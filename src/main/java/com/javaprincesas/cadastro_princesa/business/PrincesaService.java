package com.javaprincesas.cadastro_princesa.business;

import com.javaprincesas.cadastro_princesa.infrastructure.entitys.Princesa;
import com.javaprincesas.cadastro_princesa.infrastructure.repository.PrincesaRepository;
import org.springframework.stereotype.Service;

@Service
public class PrincesaService {
    private final PrincesaRepository repository;

    public PrincesaService(PrincesaRepository repository) {
        this.repository = repository;
    }

    public void salvarPrincesa(Princesa princesa){
        repository.saveAndFlush(princesa);
    }

    public Princesa buscarPrincesaPorNome(String nome){
        return repository.findByNome(nome).orElseThrow(
                () -> new RuntimeException("Nome da Princesa não encontrado")
        );
    }

    public void deletarPrincesaPorNome(String nome){
        repository.deleteByNome(nome);
    }
}
