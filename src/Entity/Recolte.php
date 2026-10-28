<?php

namespace App\Entity;

use App\Repository\RecolteRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RecolteRepository::class)]
class Recolte
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(type: 'date')]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: 'integer')]
    private ?int $poids = null;

    #[ORM\ManyToOne(inversedBy: 'recoltes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Ruche $ruche = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;
        return $this;
    }

    public function getPoids(): ?int
    {
        return $this->poids;
    }

    public function setPoids(int $poids): static
    {
        $this->poids = $poids;
        return $this;
    }

    public function getRuche(): ?Ruche
    {
        return $this->ruche;
    }

    public function setRuche(?Ruche $ruche): static
    {
        $this->ruche = $ruche;
        return $this;
    }
}
