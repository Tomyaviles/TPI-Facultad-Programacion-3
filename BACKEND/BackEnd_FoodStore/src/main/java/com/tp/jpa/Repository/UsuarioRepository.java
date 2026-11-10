package com.tp.jpa.Repository;

import com.tp.jpa.Model.Pedido;
import com.tp.jpa.Model.Usuario;
import com.tp.jpa.Utils.JpaUtils;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.Optional;

public class UsuarioRepository extends BaseRepository<Usuario>{

    public UsuarioRepository(){super(Usuario.class);}


    public Optional<Usuario> buscarPorMail(String email){
        EntityManager em = JpaUtils.getEmf().createEntityManager();

        try {
            String query = "SELECT u FROM Usuario u WHERE u.mail = :email and u.eliminado = false";
            return em.createQuery(query, Usuario.class)
                    .setParameter("email", email)
                    .getResultStream()
                    .findFirst();
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            em.close();
        }
    }


    public List<Pedido> buscarPedidoPorUsuario(Long id_usuario){
        EntityManager em = JpaUtils.getEmf().createEntityManager();

        try{
            String query = "SELECT p FROM Pedido p WHERE p.usuario_id = :id_usuario and p.eliminado = false";
            return em.createQuery(query, Pedido.class)
                    .setParameter("usuario_id", id_usuario)
                    .getResultList();
        }finally {

            em.close();
        }
    }
}
