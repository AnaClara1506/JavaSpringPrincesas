package com.javaprincesas.cadastro_princesa.controller;

import com.javaprincesas.cadastro_princesa.business.PrincesaService;
import com.javaprincesas.cadastro_princesa.infrastructure.entitys.Princesa;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/princesa")
@RequiredArgsConstructor
public class PrincesaController {

    private final PrincesaService princesaService;

    @PostMapping
    public ResponseEntity<Void> salvarPrincesa(@RequestBody Princesa princesa){
        princesaService.salvarPrincesa(princesa);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<Princesa> buscarPrincesaPorNome(@RequestParam String nome){
        return ResponseEntity.ok(princesaService.buscarPrincesaPorNome(nome));
    }

    @DeleteMapping
    public ResponseEntity<Void> deletarPrincesaPorNome(@RequestParam String nome){
        princesaService.deletarPrincesaPorNome(nome);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    public ResponseEntity<Void> atualizarPrincesaPorId (@RequestParam Integer id, Princesa princesa){
        princesaService.atualizarPrincesaPorId(id, princesa);
        return ResponseEntity.ok().build();
    }
}
