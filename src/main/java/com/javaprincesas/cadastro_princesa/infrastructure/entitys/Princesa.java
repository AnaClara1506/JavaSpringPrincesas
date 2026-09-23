package com.javaprincesas.cadastro_princesa.infrastructure.entitys;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "princesa")
@Entity

public class Princesa {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "nome", unique = true)
    private String nome;

    @Column(name = "nome_filme")
    private String nome_filme;

    @Column(name = "cor_vestido")
    private String cor_vestido;

    @Column(name = "ano_filme")
    private Integer ano_filme;
}
