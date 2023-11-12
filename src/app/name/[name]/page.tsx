import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import type { Pokemon, PokemonListResponse } from 'interfaces';
import { capitalized, getPokemonInfo } from 'utils';
import { PokemonCard } from 'components/pokemon';
import { pokeApi } from 'api';
import { openGraphImage } from 'app/shared-metadata';

interface PageProps {
  params: {
    name: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const pokemon = await loadPokemon(params.name);

  return {
    title: capitalized(pokemon.name),
    description: `Information about ${capitalized(pokemon.name)}`,
    keywords: [`pokemon, pokedex, ${pokemon.name}`],
    openGraph: {
      ...openGraphImage,
      title: capitalized(pokemon.name),
      description: `Page where you will find info about ${capitalized(
        pokemon.name
      )}`,
    },
  };
}

export async function generateStaticParams() {
  const { data } = await pokeApi.get<PokemonListResponse>('/pokemon?limit=151');
  const allPokemons: string[] = data.results.map((pokemon) => pokemon.name);
  return allPokemons.map((name) => ({
    name,
  }));
}

const loadPokemon = async (name: string) => {
  const pokemon = await getPokemonInfo(name);
  return pokemon as Pokemon;
};

export default async function PokemonPage({ params }: PageProps) {
  const pokemon = await loadPokemon(params.name);
  if (!pokemon) return redirect('/');
  return <PokemonCard pokemon={pokemon} />;
}
