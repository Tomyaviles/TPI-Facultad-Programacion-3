package com.tp.jpa.Model;

import com.tp.jpa.Model.Enums.Rol;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(name = "usuarios")
public class Usuario extends Base {

    private String nombre;
    private String apellido;

    @Column(unique = true)
    private String mail;

    private String celular;
    private String contrasena;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Pedido> pedidos = new HashSet<>();
}