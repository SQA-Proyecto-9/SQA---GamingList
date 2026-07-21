package com.info.GamingList.service;

import com.info.GamingList.model.Videojuego;
import com.info.GamingList.repository.RepositorioVideojuego;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ServicioVideojuegoTest {

    @Mock
    private RepositorioVideojuego repositorioVideojuego;

    @InjectMocks
    private ServicioVideojuego servicioVideojuego;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @Tag("RF-03")
    /* Simula una lista de videojuegos y  Verifica que el servicio la devuelva correctamente. */
    void testObtenerVideojuegos() {
        List<Videojuego> mockVideojuegos = new ArrayList<>();
        mockVideojuegos.add(new Videojuego(1, "Elden Ring", "Action RPG", "Sinopsis", 2022, new ArrayList<>()));
        
        when(repositorioVideojuego.obtenerTodos()).thenReturn(mockVideojuegos);

        List<Videojuego> result = servicioVideojuego.obtenerVideojuegos();

        assertEquals(1, result.size());
        assertEquals("Elden Ring", result.getFirst().getNombre());
        verify(repositorioVideojuego, times(1)).obtenerTodos();
    }

    @Test
    @Tag("RF-04")
    // Simula la búsqueda por ID. Verifica que el videojuego correcto sea retornado.
    void testObtenerVideojuegoPorId() {
        Videojuego mockVideojuego = new Videojuego(1, "Elden Ring", "Action RPG", "Sinopsis", 2022, new ArrayList<>());
        
        when(repositorioVideojuego.obtenerPorId(1)).thenReturn(mockVideojuego);

        Videojuego result = servicioVideojuego.obtenerVideojuego(1);

        assertNotNull(result);
        assertEquals("Elden Ring", result.getNombre());
        verify(repositorioVideojuego, times(1)).obtenerPorId(1);
    }

    @Test
    @Tag("RF-03")
    //Simula agregar un juego nuevo. Verifica que se guarde.
    void testAgregarJuegoExitoso() throws Exception {
        Videojuego videojuego = new Videojuego(1, "Persona 5", "JRPG", "Sinopsis", 2016, new ArrayList<>());
        
        when(repositorioVideojuego.obtenerPorNombre("Persona 5")).thenReturn(null);

        Videojuego result = servicioVideojuego.agregarJuego(videojuego);

        assertNotNull(result);
        assertEquals("Persona 5", result.getNombre());
        verify(repositorioVideojuego, times(1)).agregar(videojuego);
    }

    @Test
    @Tag("RF-03")
    //Simula que el juego ya existe. Verifica que el servicio lance una excepción.
    void testAgregarJuegoExistenteLanzaExcepcion() {
        Videojuego videojuego = new Videojuego(1, "Persona 5", "JRPG", "Sinopsis", 2016, new ArrayList<>());
        
        when(repositorioVideojuego.obtenerPorNombre("Persona 5")).thenReturn(videojuego);

        Exception exception = assertThrows(Exception.class, () -> servicioVideojuego.agregarJuego(videojuego));

        assertEquals("El videojuego ya existe en el catálogo.", exception.getMessage());
        verify(repositorioVideojuego, never()).agregar(any());
    }

    @Test
    @Tag("RF-03")
    //Simula una lista de videojuegos con IDs. Verifica que el siguiente ID se calcule correctamente.
    void testCalcularIdSiguiente() {
        List<Videojuego> mockVideojuegos = Arrays.asList(
                new Videojuego(1, "Juego 1", "", "", 2020, new ArrayList<>()),
                new Videojuego(5, "Juego 5", "", "", 2021, new ArrayList<>())
        );

        when(repositorioVideojuego.obtenerTodos()).thenReturn(mockVideojuegos);

        int siguienteId = servicioVideojuego.calcularIdSiguiente();

        assertEquals(6, siguienteId);
    }
}
