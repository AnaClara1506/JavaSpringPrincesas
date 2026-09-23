package com.javaprincesas.cadastro_princesa.infrastructure.repository;

import com.javaprincesas.cadastro_princesa.infrastructure.entitys.Princesa;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PrincesaRepository extends JpaRepository<Princesa, Integer> {

    Optional<Princesa> findByNome(String nome);

    @Transactional
    void deleteByNome(String nome);
}
