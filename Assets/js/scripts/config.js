// config.js
// Centraliza o BASE_PATH para todos os scripts
const Subdiretorio = true; // Define se o site está em um subdiretório
const SubdiretorioNome = "Site-Manga"; // ou qualquer outro nome

function getBasePath() 
{
  if(Subdiretorio === true) 
  {
    // Procura '/Site-Manga/' em qualquer parte do path
    const regex = new RegExp(`(\\/.*${SubdiretorioNome}\\/)+`, 'i');
    const match = window.location.pathname.match(regex);
    if (match !== undefined && match !== null && match[0]) 
    {
      // Garante que termina com '/'
      let base = match[0];
      if (!base.endsWith('/')) 
        base += '/';

      return base;
    }
  }  

  // Caso contrário, usa root
  return '/';
}

const BASE_PATH = getBasePath();

export { BASE_PATH, Subdiretorio };