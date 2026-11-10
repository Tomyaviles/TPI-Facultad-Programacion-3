package com.tp.jpa.Utils;

import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Persistence;

public class JpaUtils {


    private static final EntityManagerFactory emf =
            Persistence.createEntityManagerFactory("miUnidad");


    public static EntityManagerFactory getEmf() { return emf;}

    public static void close() {
        if (emf != null && emf.isOpen()) {
            emf.close();
        }
    }
}
