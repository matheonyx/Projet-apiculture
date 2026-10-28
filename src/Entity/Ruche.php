<?php

namespace App\Entity;

use App\Repository\RucheRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RucheRepository::class)]
class Ruche
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column(type: 'float')]
    private ?float $latitude = null;

    #[ORM\Column(type: 'float')]
    private ?float $longitude = null;

    #[ORM\OneToMany(targetEntity: Intervention::class, mappedBy: 'ruche', cascade: ['remove'], orphanRemoval: true)]
    private Collection $interventions;

    #[ORM\OneToMany(targetEntity: Recolte::class, mappedBy: 'ruche', cascade: ['remove'], orphanRemoval: true)]
    private Collection $recoltes;

    public function __construct()
    {
        $this->interventions = new ArrayCollection();
        $this->recoltes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(float $latitude): static
    {
        $this->latitude = $latitude;
        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(float $longitude): static
    {
        $this->longitude = $longitude;
        return $this;
    }

    public function getInterventions(): Collection
    {
        return $this->interventions;
    }

    public function getRecoltes(): Collection
    {
        return $this->recoltes;
    }
}
