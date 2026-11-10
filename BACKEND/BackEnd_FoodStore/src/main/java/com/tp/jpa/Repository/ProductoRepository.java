package com.tp.jpa.Repository;

import com.tp.jpa.Model.Base;
import com.tp.jpa.Model.Categoria;
import com.tp.jpa.Model.Producto;
import com.tp.jpa.Utils.JpaUtils;
import jakarta.persistence.EntityManager;

import java.util.List;

public class ProductoRepository extends BaseRepository<Producto> {

    public ProductoRepository(){super(Producto.class);}


    public List<Producto> buscarPorCategoria(Long idCategoria){
        EntityManager em = JpaUtils.getEmf().createEntityManager();

        try{
            String query = "SELECT p FROM Producto p WHERE p.categoria.id = :idCategoria AND p.eliminado = false";
            return em.createQuery(query, Producto.class)
                    .setParameter("idCategoria", idCategoria)
                    .getResultList();
        }finally {
            em.close();
        }
    }
}
