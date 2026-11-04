<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class SecurityController extends AbstractController
{
    #[Route('/', name: 'app_login')]
    public function login(Request $request): Response
    {
        $session = $request->getSession();
        if ($session->get('apiculteur_connecte')) {
            return $this->redirectToRoute('app_ruche_index');
        }

        $error = false;
        if ($request->isMethod('POST')) {
            $user = $request->request->get('username');
            $pass = $request->request->get('password');

            if ($user === 'apiculteur' && $pass === '1234') {
                $session->set('apiculteur_connecte', true);
                $session->set('apiculteur_nom', $user);
                return $this->redirectToRoute('app_ruche_index');
            } else {
                $error = true;
            }
        }

        return $this->render('security/login.html.twig', [
            'error' => $error,
        ]);
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout(Request $request): Response
    {
        $session = $request->getSession();
        $session->remove('apiculteur_connecte');
        $session->remove('apiculteur_nom');
        return $this->redirectToRoute('app_login');
    }
}
