package com.tp.jpa.Repository;

import com.tp.jpa.Model.Base;
import com.tp.jpa.Model.Pedido;
import com.tp.jpa.Utils.JpaUtils;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;

import java.util.List;
import java.util.Optional;

public class BaseRepository <T extends Base>{

    private final Class<T> clasz;

    protected BaseRepository(Class<T> clasz) {
        this.clasz = clasz;
    }



            /// GUARDAR

    public T guardar(T t){
        EntityManager em = JpaUtils.getEmf().createEntityManager();
        try{
            em.getTransaction().begin();
            T resultado = em.merge(t);
            em.getTransaction().commit();
            return resultado;
        }catch (Exception e){
            if(em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        }finally {
            em.close();
        }

    }



        /// BUSCAR POR ID


    public Optional<T> buscarPorId(Long id){
        EntityManager em = JpaUtils.getEmf().createEntityManager();

        try{
            return Optional.ofNullable(em.find(clasz, id));
        }finally {
            em.close();
        }
    }


            /// LISTAR ACTIVOS

    public List<T> listarActivos(){
        EntityManager em = JpaUtils.getEmf().createEntityManager();

        try{
            String jpqlQuery = "SELECT e FROM "+ clasz.getSimpleName() + " e WHERE e.eliminado = false";
            return em.createQuery(jpqlQuery, clasz).getResultList();

        }finally {
            em.close();
        }
    }


            /// ELIMINADO LOGICO

    public boolean eliminadoLogico(Long id){
        EntityManager em = JpaUtils.getEmf().createEntityManager();

        try{
            em.getTransaction().begin();
           T resultado = em.find(clasz, id);
           if(resultado != null){
               resultado.setEliminado(true);
               em.merge(resultado);
               em.getTransaction().commit();
               return true;
           }else return false;

        }catch (Exception e){
            if (em.getTransaction().isActive()) em.getTransaction().rollback();
            throw e;
        }finally {
            em.close();
        }
    }



}
