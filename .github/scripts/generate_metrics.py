import json
import glob
import re
import xml.etree.ElementTree as ET
import os

branch = os.environ.get('BRANCH', 'main')

rf_metrics = {}

def get_rf_metric(rf):
    if rf not in rf_metrics:
        rf_metrics[rf] = {'total': 0, 'failed': 0}
    return rf_metrics[rf]

def add_rf_result(rf, passed, failed):
    m = get_rf_metric(rf)
    m['total'] += passed + failed
    m['failed'] += failed

# 1. CYPRESS METRICS
cypress_json_path = 'cypress/results/mochawesome.json'
cypress_results = {}
unique_cypress_sistema = set()
unique_cypress_aceptacion = set()

def process_cypress_suite(suite_obj):
    suite_name = suite_obj.get('title', '').lower()
    suite_key = 'sistema' if 'suite de sistema' in suite_name else ('aceptacion' if 'suite de aceptaci' in suite_name else 'unknown')
    
    total = 0
    passed = 0
    failed = 0
    
    # Process tests in this suite
    for test in suite_obj.get('tests', []):
        total += 1
        if test.get('pass'): passed += 1
        if test.get('fail'): failed += 1
        
        # Extract RF
        match = re.search(r'\[(RF-\d+)\]', test.get('title', ''))
        if match:
            add_rf_result(match.group(1), 1 if test.get('pass') else 0, 1 if test.get('fail') else 0)
            
        # Extract Test Case ID for Cypress (TB-XX or TS-XX)
        tc_match = re.search(r'(T[BS]-\d+)', test.get('title', ''))
        if tc_match:
            if suite_key == 'sistema':
                unique_cypress_sistema.add(tc_match.group(1))
            elif suite_key == 'aceptacion':
                unique_cypress_aceptacion.add(tc_match.group(1))
    
    # Only store suite metrics if this is one of our target suites and it has tests
    if suite_key != 'unknown' and total > 0:
        cypress_results[suite_key] = {'total': total, 'passed': passed}
        
    # Recurse into sub-suites
    for sub in suite_obj.get('suites', []):
        process_cypress_suite(sub)

try:
    with open(cypress_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        for suite in data.get('results', []):
            process_cypress_suite(suite)
            
    if cypress_results:
        print(f'# HELP gaminglist_cypress_tests_total Total Cypress tests')
        print(f'# TYPE gaminglist_cypress_tests_total gauge')
        for suite_key, counts in cypress_results.items():
            print(f'gaminglist_cypress_tests_total{{branch="{branch}",suite="{suite_key}"}} {counts["total"]}')
            
        print(f'# HELP gaminglist_cypress_tests_passed Passed Cypress tests')
        print(f'# TYPE gaminglist_cypress_tests_passed gauge')
        for suite_key, counts in cypress_results.items():
            print(f'gaminglist_cypress_tests_passed{{branch="{branch}",suite="{suite_key}"}} {counts["passed"]}')
except Exception as e:
    print(f"# Error processing Cypress metrics: {e}")

# 2. NEWMAN METRICS
newman_json_path = 'reports/newman-summary.json'
unique_newman_tc = set()
try:
    with open(newman_json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        for execution in data.get('run', {}).get('executions', []):
            item_name = execution.get('item', {}).get('name', '')
            assertions = execution.get('assertions', [])
            failed_assertions = [a for a in assertions if 'error' in a]
            
            matches = re.findall(r'RF-\d+', item_name)
            is_fail = len(failed_assertions) > 0
            for rf in matches:
                add_rf_result(rf, 0 if is_fail else 1, 1 if is_fail else 0)
                
            tc_match = re.search(r'(TG-\d+)', item_name)
            if tc_match:
                unique_newman_tc.add(tc_match.group(1))
except Exception as e:
    print(f"# Error processing Newman metrics: {e}")

# 3. JUNIT METRICS
method_tags = {}
unique_junit_tc = set()
try:
    for filepath in glob.glob('GamingList-main/src/test/java/**/*.java', recursive=True):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            for match in re.finditer(r'@Tag\("([^"]+)"\)[\s\S]*?void\s+(\w+)', content):
                method_tags[match.group(2)] = match.group(1)
except Exception as e:
    print(f"# Error processing JUnit Java files: {e}")

try:
    for xml_path in glob.glob('GamingList-main/target/surefire-reports/*.xml'):
        tree = ET.parse(xml_path)
        root = tree.getroot()
        for testcase in root.findall('testcase'):
            method_name = testcase.get('name')
            if method_name in method_tags:
                rf = method_tags[method_name]
                failures = testcase.findall('failure')
                errors = testcase.findall('error')
                is_fail = len(failures) > 0 or len(errors) > 0
                add_rf_result(rf, 0 if is_fail else 1, 1 if is_fail else 0)
                unique_junit_tc.add(method_name)
except Exception as e:
    print(f"# Error processing JUnit XML files: {e}")

# OUTPUT RF METRICS
if len(rf_metrics) > 0:
    print(f'# HELP gaminglist_tests_by_rf_total Total tests per RF')
    print(f'# TYPE gaminglist_tests_by_rf_total gauge')
    for rf, counts in rf_metrics.items():
        print(f'gaminglist_tests_by_rf_total{{branch="{branch}",rf="{rf}"}} {counts["total"]}')

    print(f'# HELP gaminglist_tests_by_rf_failed Failed tests per RF')
    print(f'# TYPE gaminglist_tests_by_rf_failed gauge')
    for rf, counts in rf_metrics.items():
        print(f'gaminglist_tests_by_rf_failed{{branch="{branch}",rf="{rf}"}} {counts["failed"]}')

# OUTPUT TEST CASES COVERAGE METRICS
print(f'# HELP gaminglist_executed_test_cases_total Total number of unique test cases executed')
print(f'# TYPE gaminglist_executed_test_cases_total gauge')
print(f'gaminglist_executed_test_cases_total{{branch="{branch}",type="unit"}} {len(unique_junit_tc)}')
print(f'gaminglist_executed_test_cases_total{{branch="{branch}",type="integration"}} {len(unique_newman_tc)}')
print(f'gaminglist_executed_test_cases_total{{branch="{branch}",type="system"}} {len(unique_cypress_sistema)}')
print(f'gaminglist_executed_test_cases_total{{branch="{branch}",type="acceptance"}} {len(unique_cypress_aceptacion)}')
