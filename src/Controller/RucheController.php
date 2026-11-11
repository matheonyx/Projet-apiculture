<?php

namespace App\Controller;

use App\Entity\Ruche;
use App\Repository\RucheRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class RucheController extends AbstractController
{
    #[Route('/apiculteur', name: 'app_ruche_index')]
    public function index(Request $request, RucheRepository $repo): Response
    {
        $session = $request->getSession();
        if (!$session->get('apiculteur_connecte')) {
            return $this->redirectToRoute('app_login');
        }

        $ruches = $repo->findAll();

        return $this->render('ruche/index.html.twig', [
            'ruches' => $ruches,
        ]);
    }

    #[Route('/api/ruches', name: 'api_ruches_list', methods: ['GET'])]
    public function listApi(RucheRepository $repo): JsonResponse
    {
        $ruches = $repo->findAll();
        $data = [];
        foreach ($ruches as $r) {
            $data[] = [
                'id' => $r->getId(),
                'nom' => $r->getNom(),
                'lat' => $r->getLatitude(),
                'lng' => $r->getLongitude(),
            ];
        }
        return $this->json($data);
    }

    #[Route('/ruche/ajouter', name: 'app_ruche_add', methods: ['POST'])]
    public function add(Request $request, EntityManagerInterface $em): Response
    {
        $session = $request->getSession();
        if (!$session->get('apiculteur_connecte')) {
            return $this->redirectToRoute('app_login');
        }

        $nom = trim((string) $request->request->get('nom'));
        $lat = (float) $request->request->get('lat');
        $lng = (float) $request->request->get('lng');

        if ($nom !== '' && $lat >= -90 && $lat <= 90 && $lng >= -180 && $lng <= 180) {
            $ruche = new Ruche();
            $ruche->setNom($nom);
            $ruche->setLatitude($lat);
            $ruche->setLongitude($lng);

            $em->persist($ruche);
            $em->flush();
        }

        return $this->redirectToRoute('app_ruche_index');
    }

    #[Route('/ruche/{id}/supprimer', name: 'app_ruche_delete', methods: ['POST'])]
    public function delete(Ruche $ruche, EntityManagerInterface $em): Response
    {
        $em->remove($ruche);
        $em->flush();

        return $this->redirectToRoute('app_ruche_index');
    }
}
