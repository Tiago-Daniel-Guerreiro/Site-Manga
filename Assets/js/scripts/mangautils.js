import { BASE_PATH } from './config.js';

export function redirecionarPara404() 
{
    if (window.location.pathname === BASE_PATH + '404')
        return;

    window.history.replaceState({}, '', BASE_PATH + '404');
    window.dispatchEvent(new PopStateEvent('popstate'));
}

export async function verificarManga_Utils(mangaId) 
{
    if (mangaId === null || mangaId === undefined || mangaId === '')
        return false;

    try 
    {
        const url = BASE_PATH + `Mangas/${mangaId}/Info.json`;
        const resposta = await fetch(url);

        if (resposta.ok !== true)
            return false;

        const info = await resposta.json();

        if (info !== null && info.Titulo !== null && info.Titulo !== undefined)
            return true;

        return false;
    } 
    catch (e)
    {
        return false;
    }
}

export async function verificarCap_Utils(mangaId, capId) 
{
    if (mangaId === null || capId === null)
        return false;

    try 
    {
        const url = BASE_PATH + `Mangas/${mangaId}/Caps.json`;
        const resp = await fetch(url);

        if (resp.ok !== true)
            return false;

        const contentType = resp.headers.get('content-type');

        if (contentType === null || contentType === undefined)
            return false;

        if (contentType.includes('application/json') !== true)
            return false;

        const caps = await resp.json();

        if (Array.isArray(caps) !== true)
            return false;

        for (let i = 0; i < caps.length; i++)
        {
            if (String(caps[i].nome) === String(capId))
                return true;
        }
        return false;
    } 
    catch(e)
    {
        return false;
    }
}

export async function ObterListaDeIdsValidos() 
{
    let ids = [];
    let id = 0;
    let consecutivosSemEncontrar = 0;

    while (consecutivosSemEncontrar < 2) 
    {
        try 
        {
            const url = BASE_PATH + `Mangas/${id}/Info.json`;
            const resp = await fetch(url);

            if (resp.ok !== true)
            {
                consecutivosSemEncontrar++;
                id++;
                continue;
            }

            const info = await resp.json();

            if (info !== null && info.Titulo !== null && info.Titulo !== undefined && info.Titulo !== '')
            {
                ids.push(id);
                consecutivosSemEncontrar = 0;
            }
            else
                consecutivosSemEncontrar++;
        } 
        catch(e)
        {
            consecutivosSemEncontrar++;
        }

        id++;
    }
    return ids;
}

export async function ObterTituloPeloId(id)
{
    if (id === null || id === undefined || id === '')
        return null;

    try 
    {
        const url = BASE_PATH + `Mangas/${id}/Info.json`;
        const resp = await fetch(url);

        if (resp.ok !== true)
            return null;

        const info = await resp.json();

        if (info === null)
            return null;

        if (info.Titulo === null || info.Titulo === undefined || info.Titulo === '')
            return null;

        return info.Titulo;
    } 
    catch (e)
    {
        return null;
    }
}

export function ObterCapaPeloId(id) 
{
    return BASE_PATH + `Mangas/${id}/Capa.webp`;
}

export async function ObterCapsPeloId(id) 
{
    try 
    {
        const url = BASE_PATH + `Mangas/${id}/Caps.json`;
        const resp = await fetch(url);

        if (resp.ok !== true)
            return [];

        const json = await resp.json();
        return json;
    } 
    catch(e)
    {
        return [];
    }
}

export async function ObterNomesCapsValidos(mangaId) 
{
    try 
    {
        const url = BASE_PATH + `Mangas/${mangaId}/Caps.json`;
        const resp = await fetch(url);

        if (resp.ok !== true)
            return [];

        const caps = await resp.json();

        if (Array.isArray(caps) !== true)
            return [];

        const nomes = [];

        for (let i = 0; i < caps.length; i++) 
        {
            const nome = caps[i].nome;
            if (nome !== null && nome !== undefined && nome !== '')
                nomes.push(nome);
        }

        return nomes;
    } 
    catch (e)
    {
        return [];
    }
}

export async function ObterInfoPeloId(id) 
{
    try 
    {
        const url = BASE_PATH + `Mangas/${id}/Info.json`;
        const resp = await fetch(url);

        if (resp.ok !== true)
            return null;
        
        const info = await resp.json();
        return info;
    } 
    catch (e)
    {
        return null;
    }
}

export async function obterCapAnteriorProximo(mangaId, capId, proximo)
{
    try 
    {
        const url = BASE_PATH + 'Mangas/' + mangaId + '/Caps.json';
        const resp = await fetch(url);

        if (resp.ok !== true)
            return null;

        const caps = await resp.json();

        if (Array.isArray(caps) !== true)
            return null;

        let idx = -1;
        let i = 0;

        while (i < caps.length)
        {
            if (String(caps[i].nome) === String(capId))
            {
                idx = i;
                break;
            }
            i = i + 1;
        }

        if (idx === -1)
            return null;

        if (proximo === true)
        {
            if (idx < caps.length - 1)
                return caps[idx + 1].nome;

            return null;
        }
        else
        {
            if (idx > 0)
                return caps[idx - 1].nome;

            return null;
        }
    }
    catch (e)
    {
        return null;
    }
}