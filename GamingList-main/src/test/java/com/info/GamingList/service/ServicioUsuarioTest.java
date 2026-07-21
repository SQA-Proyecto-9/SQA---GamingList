package com.info.GamingList.service;

import com.info.GamingList.model.Usuario;
import com.info.GamingList.repository.RepositorioUsuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ServicioUsuarioTest {

    @Mock
    private RepositorioUsuario repositorioUsuario;

    @InjectMocks
    private ServicioUsuario servicioUsuario;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @Tag("RF-02")
    void testValidarUsuarioExitoso() {
        Usuario mockUsuario = new Usuario(new ArrayList<>(), "testuser", "password123");
        when(repositorioUsuario.obtenerPorUsername("testuser")).thenReturn(mockUsuario);

        Usuario result = servicioUsuario.validarUsuario("testuser", "password123");

        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
    }

    @Test
    @Tag("RF-02")
    void testValidarUsuarioFallido() {
        Usuario mockUsuario = new Usuario(new ArrayList<>(), "testuser", "password123");
        when(repositorioUsuario.obtenerPorUsername("testuser")).thenReturn(mockUsuario);

        Usuario result = servicioUsuario.validarUsuario("testuser", "wrongpassword");

        assertNull(result);
    }

    @Test
    @Tag("RF-01")
    void testRegistrarUsuarioExitoso() {
        Usuario usuario = new Usuario(new ArrayList<>(), "newuser", "pass");
        when(repositorioUsuario.obtenerPorUsername("newuser")).thenReturn(null);

        boolean result = servicioUsuario.registrarUsuario(usuario);

        assertTrue(result);
        verify(repositorioUsuario, times(1)).agregar(usuario);
    }

    @Test
    @Tag("RF-01")
    void testRegistrarUsuarioExistente() {
        Usuario usuario = new Usuario(new ArrayList<>(), "existinguser", "pass");
        when(repositorioUsuario.obtenerPorUsername("existinguser")).thenReturn(usuario);

        boolean result = servicioUsuario.registrarUsuario(usuario);

        assertFalse(result);
        verify(repositorioUsuario, never()).agregar(any());
    }
}
