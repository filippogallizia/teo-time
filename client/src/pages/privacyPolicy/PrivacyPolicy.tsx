import React from 'react';
import { SUB_TITLE, TITLE } from '../../shared/locales/constant';

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col gap-8 line leading-loose">
      <h1 className={`${TITLE} my-4`}>Google OAuth2 Homepage</h1>
      <p>
        Osteotherapy.it e' un sito web che permette ai clienti di Matteo
        Bulgheroni di avere informazioni riguardo i suoi servizi e di
        prenotarli.
      </p>
      <p>
        Non tutti i contenuti di questo sito sono pubblici. Devi registrarti per
        avere accesso ad alcuni contenuti.
      </p>
      <p>
        Quando accedi, condividerai con l'amministratore del sito alcuni dati
        personali.{' '}
      </p>
      <p className="font-bold">
        {' '}
        Cosa farà questa sito con i dati degli utenti?{' '}
      </p>
      <ul className="flex flex-col gap-4">
        <li>
          {' '}
          Gli unici dati dell'utente ricevuti sono: nome, email, numero di
          telefono, foto del profilo e permesso di cambiare gli eventi sul
          google calendar.
        </li>
        <li>
          L'email sarà usata per identificare l'utente e per rispondere ai
          messaggi inviati dall'utente.{' '}
        </li>
        <li>
          La foto del profilo e' usata solo come foto del profilo dell' utente.
        </li>
        <li>
          Il numero di telefono e' usato solo in caso di urgenza nel contattare
          il cliente per modificare qualche prenotazione.
        </li>
        <li>
          {' '}
          Il permesso di aggiungere e rimuovere eventi dal tuo google Calendar
          e' utilizzato solamente per aggiungere o rimuovere le tue
          prenotazioni, niente altro.{' '}
        </li>
      </ul>
      <p className="font-bold">
        In nessun caso i dati dell' utente sono condivisi con altri od
        utilizzati per fini differenti da quelli di questa attivita'. Se hai
        delle domande, puoi contattarci in qualsiasi momento. Assicurati di
        includere un indirizzo e-mail in modo che sappiamo dove inviare la
        risposta.
      </p>

      <h2 className={`${SUB_TITLE}  my-4`}>Copyright</h2>

      <p>
        Se avete un reclamo di copyright, per favore comunicatecelo e includete
        l osteotherapy.it url che contiene il presunto contenuto,
        identificazione dell'opera che si ritiene sia stata violata, compreso il
        nome e la risposta indirizzo e-mail del titolare/rappresentante del
        copyright, un'asserzione che l'uso del materiale non è autorizzato e
        l'affermazione che tu sei il titolare/rappresentante del copyright.
      </p>
      <h2 className={`${SUB_TITLE}  my-4`}>Termini del servizio</h2>
      <p>
        Questo sito è progettato per promuovere i nostri servizi e dare la
        possibilita' ai clienti di prenotarli. È fornito "così com'è", senza
        alcuna garanzia o condizione, espressa o implicita o legale. Questo sito
        declina specificamente qualsiasi garanzia implicita di commerciabilità o
        idoneità per uno scopo particolare. Continuando ad utilizzare questo
        sito, accettate questi termini di servizio in pieno. Se non siete
        d'accordo con questi termini, non dovete usare questo sito.
      </p>
      <h2 className={`${SUB_TITLE}  my-4`}>Cookies</h2>
      <p>
        I cookie sono brevi messaggi inviati dal tuo browser ai siti web che
        visiti. Questo sito utilizza i cookies. Utilizzando questo sito
        acconsenti all'uso dei cookie. Questo sito utilizza i cookie per
        identificare chi ha effettuato l'accesso e Google Analytics utilizza i
        cookie per registrare il comportamento di navigazione in forma anonima.
      </p>
    </div>
  );
}
