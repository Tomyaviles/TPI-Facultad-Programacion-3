package com.tp.jpa.Repository;

import com.tp.jpa.Model.Enums.Estado;
import com.tp.jpa.Model.Pedido;
import com.tp.jpa.Model.Producto;
import com.tp.jpa.Utils.JpaUtils;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.Optional;

public class PedidoRepository extends BaseRepository<Pedido>{

    public PedidoRepository(){super(Pedido.class);}


    public Pedido modificarEstado(Estado estado, Long id_pedido){
        EntityManager em = JpaUtils.getEmf().createEntityManager();

        try{
            em.getTransaction().begin();
            Optional<Pedido> pedido = buscarPorId(id_pedido);

            pedido.get().setEstado(estado);
            em.merge(pedido.get());
            em.getTransaction().commit();
            return pedido.get();
        }finally {
            em.close();
        }
    }
    public List<Pedido> buscarPorEstado(Estado estado){
            EntityManager em = JpaUtils.getEmf().createEntityManager();

            try{
                String query = "SELECT p FROM Pedido p JOIN FETCH p.detalles WHERE p.estado = :estado AND p.eliminado = false";
                return em.createQuery(query, Pedido.class)
                        .setParameter("estado", estado)
                        .getResultList();
            }finally {
                em.close();
            }
    }

    public List<Pedido> buscarPorUsuario(Long id_usuario){
        EntityManager em = JpaUtils.getEmf().createEntityManager();

        try{
            String query = "SELECT DISTINCT p FROM Pedido p JOIN FETCH p.detalles WHERE p.usuario.id = :id_usuario AND p.eliminado = false";
            return em.createQuery(query, Pedido.class)
                    .setParameter("id_usuario", id_usuario)
                    .getResultList();
        }finally {
            em.close();
        }
    }



        public List<Pedido> listarPedidos(){
        EntityManager em = JpaUtils.getEmf().createEntityManager();

        try{
            List<Pedido> pedidos = em.createQuery(
                    "SELECT DISTINCT p FROM Pedido p JOIN FETCH p.detalles WHERE p.eliminado = false", Pedido.class
            ).getResultList();

            return pedidos;
        }finally {
            em.close();
        }
        }
}
