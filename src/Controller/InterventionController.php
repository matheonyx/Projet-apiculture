<?php

namespace App\Controller;

use App\Entity\Intervention;
use App\Entity\Ruche;
use App\Repository\InterventionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class InterventionController extends AbstractController
{
    #[Route('/api/ruche/{id}/interventions', name: 'api_ruche_interventions', methods: ['GET'])]
    public function list(Ruche $ruche, Request $request, InterventionRepository $repo): JsonResponse
    {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = 10;
        $offset = ($page - 1) * $limit;

        $total = $repo->count(['ruche' => $ruche]);
        $interventions = $repo->findBy(
            ['ruche' => $ruche],
            ['date' => 'DESC'],
            $limit,
            $offset
        );

        $data = [];
        foreach ($interventions as $i) {
            $data[] = [
                'id' => $i->getId(),
                'date' => $i->getDate()->format('Y-m-d H:i'),
                'texte' => $i->getTexte(),
            ];
        }

        return $this->json([
            'items' => $data,
            'total' => $total,
            'page' => $page,
            'totalPages' => (int) ceil($total / $limit),
        ]);
    }

    #[Route('/api/ruche/{id}/interventions/ajouter', name: 'api_intervention_add', methods: ['POST'])]
    public function add(Ruche $ruche, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $texte = trim((string) $request->request->get('texte'));
        if ($texte === '') {
            return $this->json(['error' => 'Texte obligatoire'], 400);
        }

        $intervention = new Intervention();
        $intervention->setRuche($ruche);
        $intervention->setDate(new \DateTime());
        $intervention->setTexte($texte);

        $em->persist($intervention);
        $em->flush();

        return $this->json([
            'success' => true,
            'item' => [
                'id' => $intervention->getId(),
                'date' => $intervention->getDate()->format('Y-m-d H:i'),
                'texte' => $intervention->getTexte(),
            ]
        ]);
    }
}
