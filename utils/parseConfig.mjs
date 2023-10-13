import YAML from 'yaml';
import { READ_FILE } from './osBindings.mjs';

export async function parse_yaml(filepath) {
    let yaml_data = await READ_FILE(filepath);
    return YAML.parse(yaml_data);
}

export function bind_config(key, value) {
    switch (key) {
        case 'title':
            return `${value}`;
        case 'favicon':
            return `<meta rel="icon" type="image/x-icon" href="${value}"/>`;
        case 'css': {
            let buff = '';
            for (const css_url in value) {
                buff += `<link rel="stylesheet" href="${value[css_url]}"/>`;
            }
            return buff;
        }
        case 'cache': {
            let buff = `<meta http-equiv="Cache-Control" content="`;
            if (!value['enable']) {
                return (buff += `no-store, no-cache, must-revalidate"/>`);
            }
            if (value['max-age']) {
                buff += `max_age=${value['max-age']}`;
            }
            if (value['additional']) {
                buff += `, ${value['additional']}`;
            }

            return (buff += `"/>`);
        }

        case 'head': {
            let buff = '';
            for (const arr in value) {
                for (const start_tag in value[arr]) {
                    for (const attributes in value[arr][start_tag]) {
                        buff += `<${start_tag} ${value[arr][start_tag][attributes]}/>`;
                    }
                }
            }
            return buff;
        }

        case 'embed': {
            let buff = '';
            for (const attribute in value) {
                switch (attribute) {
                    case 'title':
                        buff += `<meta content="${value[attribute]}" property="og:title" />`;
                        continue;
                    case 'description':
                        buff += `<meta content="${value[attribute]}" property="og:description" />`;
                        continue;
                    case 'url':
                        buff += `<meta content="${value[attribute]}" property="og:url" />`;
                        continue;
                    case 'image':
                        buff += `<meta content="${value[attribute]}" property="og:image" />`;
                        continue;
                    case 'enhance_image':
                        if (value[attribute]) {
                            buff += `<meta name="twitter:card" content="summary_large_image">`;
                        }
                        continue;
                    case 'color': {
                        buff += `<meta content="${value[attribute]}" data-react-helmet="true" name="theme-color" />`;
                    }
                }
            }
            return buff;
        }
    }
}

// (async () => {
//     let config = await parse_yaml('../template/config.yaml');
//     console.log(bind_config('embed', config['embed']));
// })();
