/* 

package com.info.GamingList.service;

import com.info.GamingList.model.Review;
import com.info.GamingList.repository.RepositorioReview;
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

class ServicioReviewTest {

    @Mock
    private RepositorioReview repositorioReview;

    @InjectMocks
    private ServicioReview servicioReview;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @Tag("RF-06")
    
    /* Simula dos reseñas con calificaciones 4 y 5.
    Verifica que el servicio calcula el promedio correcto: 4.5.

    void testCalcularCalificacionJuego() {
        Review r1 = new Review();
        r1.setCalificacion(4);
        Review r2 = new Review();
        r2.setCalificacion(5);
        
        when(repositorioReview.obtenerPorId(1)).thenReturn(Arrays.asList(r1, r2));

        float promedio = servicioReview.calcularCalificacionJuego(1);

        assertEquals(4.5f, promedio);
    }

    @Test
    @Tag("RF-06")
    
    Simula que no hay reseñas.
    Espera que el promedio sea 0.0.
     
    void testCalcularCalificacionJuegoSinReviews() {
        when(repositorioReview.obtenerPorId(1)).thenReturn(new ArrayList<>());

        float promedio = servicioReview.calcularCalificacionJuego(1);

        assertEquals(0.0f, promedio);
    }

    @Test
    @Tag("RF-06")
    /*
     * Crea una reseña nueva.
        Verifica que se llame al repositorio para guardarla.
     
    void testAgregarReview() {
        Review review = new Review();
        review.setMensaje("Genial");

        Review result = servicioReview.agregarReview(review);

        assertEquals("Genial", result.getMensaje());
        verify(repositorioReview, times(1)).agregar(review);
    }
}

*/


