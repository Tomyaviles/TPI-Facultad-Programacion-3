package com.tp.jpa.Model;

import com.tp.jpa.Model.Enums.Estado;
import com.tp.jpa.Model.Enums.FormaPago;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "pedidos")
public class Pedido extends Base implements Calculable {

    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    private Estado estado;

    private Double total;

    @Enumerated(EnumType.STRING)
    private FormaPago formaPago;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<DetallePedido> detalles = new HashSet<>();

    // ── métodos del UML ──────────────────────────────────────────────

    public void addDetallePedido(int cantidad, Producto producto) {
        DetallePedido detalle = DetallePedido.builder()
                .cantidad(cantidad)
                .subtotal(cantidad * producto.getPrecio())
                .producto(producto)
                .pedido(this)
                .build();
        this.detalles.add(detalle);
        calcularTotal();
    }

    @Override
    public void setEliminado(boolean eliminado) {
        super.setEliminado(eliminado);
        // Propagación manual del borrado lógico a los hijos
        if (this.detalles != null) {
            for (DetallePedido detalle : this.detalles) {
                detalle.setEliminado(eliminado);
            }
        }
    }

    public DetallePedido findDetallePedidoByProducto(Producto producto) {
        return detalles.stream()
                .filter(d -> d.getProducto().getId().equals(producto.getId()))
                .findFirst()
                .orElse(null);
    }

    public void deleteDetallePedidoByProducto(Producto producto) {
        detalles.removeIf(d -> d.getProducto().getId().equals(producto.getId()));
        calcularTotal();
    }

    @Override
    public void calcularTotal() {
        this.total = detalles.stream()
                .mapToDouble(DetallePedido::getSubtotal)
                .sum();
    }
}
