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

    public void atualizarPrincesaPorId(Integer id, Princesa princesa){
        Princesa princesaEntity = repository.findById(id).orElseThrow(() ->
                new RuntimeException("Princesa não encontrada"));
        Princesa princesaAtualizada = Princesa.builder()
                .nome(princesa.getNome() != null ? princesa.getNome():
                        princesaEntity.getNome())
                .nome_filme(princesa.getNome_filme() != null ? princesa.getNome_filme() :
                        princesaEntity.getNome_filme())
                .cor_vestido(princesa.getCor_vestido() != null ? princesa.getCor_vestido():
                        princesaEntity.getCor_vestido())
                .ano_filme(princesa.getAno_filme() != null ? princesa.getAno_filme():
                        princesaEntity.getAno_filme())
                .id(princesaEntity.getId())
                .build();

        repository.saveAndFlush(princesaAtualizada);
    }
}
