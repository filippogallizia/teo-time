import React from 'react';
import foto_profilo from '../../shared/images/foto_profilo.jpeg';

const HomePage = () => {
  return (
    <div className="flex flex-col gap-8 items-center justify-center text-center">
      <div
        style={{
          fontFamily: 'Delius Swash Caps, cursive',
          letterSpacing: '3px',
          fontSize: '1rem',
        }}
      >
        <p>
          “Conosci la tua anatomia e la tua fisiologia, ma quando poni le mani
          sul corpo di un paziente, non dimenticare che vi abita un’anima
          vivente”
        </p>
        <p>A.T. Still</p>
      </div>
      <div className="just flex self-stretch items-center gap-4">
        <div className="w-10">
          <div className="border-2 border-gray-900 bg-gray-900"></div>
          <div className="border-4 border-yellow-500 bg-yellow-500"></div>
        </div>
        <div className="text-bold">CHI SONO</div>
      </div>
      <img
        className="rounded-full h-40 w-40"
        src={foto_profilo}
        alt="foto_profilo"
      />
      <div>
        <p className="text-left">
          Nasce nel cuore di Milano in una delle più belle posizioni meneghine,
          in faccia all’Università Statale, un accurato studio dove prendersi
          cura del proprio corpo con trattamenti osteopatici, lezioni di
          ginnastica posturale personalizzate e trattamenti massoterapici, sotto
          la guida esperta di Matteo Bulgheroni Dottore in osteopatia, scienze
          motorie e massoterapia. Matteo Bulgheroni nasce a Milano nel 1988. Nel
          2012 si laurea in scienze motorie e dello sport Dal 2013 al 2019, per
          sei anni, segue un corso di Osteopatia di cui consegue nel 2019 il
          titolo di Osteopata, finalmente risconosciuto dal ministero della
          salute, presso AIMO (Accademia italiana medicina osteopatica) In
          contemporanea segue la “Scuola della Schiena” fondata dal professor
          Benedetto Toso, diventando socio della Black Neck School. Nel 2020
          completa il percorso di studi presso la Kern School , conseguendo il
          titolo di Massoterapista ( con attestato di abilitazione all’esercizio
          dell’arte ausiliaria delle professioni sanitarie da parte della
          Regione Lombardia ) Fino al 2022 presta la sua esperienza
          professionale presso Virgin Corso Como per 2 anni, presso il 360Studio
          per 8 anni ed infine per 1 anno presso Reverbia. Nel 2022 finalmente
          apre questo suo studio dove vi aspetta con grande professionalità e
          cortesia, per un benessere pieno di luce.
        </p>
      </div>
    </div>
  );
};
export default HomePage;
