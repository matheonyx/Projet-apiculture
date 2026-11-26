<?php

namespace App\Controller;

use App\Entity\Recolte;
use App\Entity\Ruche;
use App\Repository\RecolteRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class ProductionController extends AbstractController
{
    #[Route('/api/ruche/{id}/recoltes', name: 'api_ruche_recoltes', methods: ['GET'])]
    public function list(Ruche $ruche, RecolteRepository $repo): JsonResponse
    {
        $recoltes = $repo->findBy(['ruche' => $ruche], ['date' => 'ASC']);

        $moisPoids = [
            'Jan' => 0, 'Fev' => 0, 'Mar' => 0, 'Avr' => 0, 'Mai' => 0, 'Juin' => 0,
            'Juil' => 0, 'Aout' => 0, 'Sept' => 0, 'Oct' => 0, 'Nov' => 0, 'Dec' => 0
        ];
        $moisKeys = array_keys($moisPoids);

        $totalGrammes = 0;
        foreach ($recoltes as $r) {
            $p = $r->getPoids();
            $totalGrammes += $p;
            $m = (int) $r->getDate()->format('n') - 1;
            if ($m >= 0 && $m < 12) {
                $moisPoids[$moisKeys[$m]] += $p;
            }
        }

        return $this->json([
            'moisPoids' => $moisPoids,
            'totalGrammes' => $totalGrammes,
            'totalKg' => number_format($totalGrammes / 1000, 2, '.', ''),
        ]);
    }

    #[Route('/api/ruche/{id}/recoltes/ajouter', name: 'api_recolte_add', methods: ['POST'])]
    public function add(Ruche $ruche, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $dateStr = (string) $request->request->get('date');
        $poids = (int) $request->request->get('poids');

        if ($dateStr === '' || $poids <= 0) {
            return $this->json(['error' => 'Parametres invalides'], 400);
        }

        try {
            $date = new \DateTime($dateStr);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Date invalide'], 400);
        }

        $recolte = new Recolte();
        $recolte->setRuche($ruche);
        $recolte->setDate($date);
        $recolte->setPoids($poids);

        $em->persist($recolte);
        $em->flush();

        return $this->json(['success' => true]);
    }
}
