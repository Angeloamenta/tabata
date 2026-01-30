# Rest Pause & Sets/Reps Update

Documentazione per l'implementazione della funzionalità Rest Pause e della struttura Sets/Reps/Rest in TabataPulse.

---

## Concetto Rest Pause

Il **Rest Pause** è una tecnica di allenamento dove:

1. **Fase lavoro** – Esegui l'esercizio fino a cedimento (o quasi) o per un tempo prefissato
2. **Pausa breve** – Breve pausa (tipicamente 10–30 secondi), non recupero completo
3. **Ripresa** – Riprendi subito lo stesso esercizio per altre ripetizioni
4. **Ripetizione** – Ripeti il ciclo lavoro → pausa → lavoro per N cluster/micro-serie

Obiettivo: estendere il tempo sotto tensione / volume totale oltre ciò che faresti in una serie continua.

---

## Struttura Proposta

### Configurazione con Toggle

| Toggle | Campo | Descrizione |
|--------|-------|-------------|
| **Limit by Sets** | Sets | Numero di set (es. 3) |
| **Limit by Reps** | Reps per set | Ripetizioni per set (es. 10) |
| **Include Rest** | Rest (sec) | Pausa tra i set (es. 10 secondi) |
| **Include Hold** | Hold (sec) | Come attualmente (fase isometrica) |

Concentric, Eccentric e Hold restano per definire la singola ripetizione o il ciclo di lavoro.

---

## Esempi di Flusso

### Esempio 1: 3 set × 10 reps, rest 10s

```
[Get Ready 5s]
→ Set 1: rep 1 (conc+hold+ecc) → rep 2 → ... → rep 10
→ Rest 10s
→ Set 2: rep 1 → ... → rep 10
→ Rest 10s
→ Set 3: rep 1 → ... → rep 10
→ Done
```

### Esempio 2: Modalità tempo, 3 set, 30s per set, rest 15s

```
[Get Ready 5s]
→ Set 1: 30s di lavoro (conc/hold/ecc ciclici)
→ Rest 15s
→ Set 2: 30s di lavoro
→ Rest 15s
→ Set 3: 30s di lavoro
→ Done
```

---

## Vantaggi della Struttura

1. **Rest Pause** – Micro-serie con pause brevi tra i set
2. **Classic strength** – 3×10, 4×8, 5×5 con rest tra le serie
3. **Tabata attuale** – concentric/hold/eccentric per tempo, con rest opzionale
4. **HIIT** – work/rest con timer, senza contare le reps
5. **Flessibilità** – Adatta a diverse tipologie di esercizi

---

## Integrazione con Codice Esistente

### File da modificare

- **`src/hooks/useWorkout.js`** – Logica `createSteps()` per generare gli step con set/rest
- **`src/components/Setup.jsx`** – UI: toggle Sets, Reps, Rest; campi correlati
- **`src/styles/Setup.css`** – Stili per i nuovi controlli
- **`src/index.css`** – Eventuale variabile colore per fase Rest (es. `--color-rest`)

### Logica da implementare

- **Modalità reps**: ogni "set" = N ripetizioni (concentric+hold+eccentric per ogni rep)
- **Modalità tempo**: ogni "set" = X secondi totali (come attualmente)
- **Rest**: fase di pausa tra un set e l'altro, solo se attivato
- **Suoni**: tono diverso per inizio/fine rest (es. `playRestStart`, `playRestEnd`)

### Stato config suggerito

```js
{
  sets: 3,
  repsPerSet: 10,
  totalTime: 0,
  useSets: true,
  useReps: true,
  useRest: true,
  restDuration: 10,
  concentric: 2,
  eccentric: 3,
  useIsometric: true,
  isometric: 1,
  // ...
}
```

---

## Note per lo Sviluppo

- Mantenere retrocompatibilità con la configurazione attuale (useReps, totalTime)
- Il calcolo "Est. Duration" nel Setup deve includere i rest quando attivati
- La fase Rest nell'ActiveWorkout può usare un colore neutro (es. grigio) o un colore dedicato
- Considerare tick audio durante il rest (opzionale, per countdown)

---

*Creato: 30 Gen 2025*
