import string
import yaml
import random
import os
from lib.generate_tiles import render_tiles

CONFIG_FILE = './config/config.yaml'


def get_config():
    with open(CONFIG_FILE) as f:
        return yaml.load(f, Loader=yaml.Loader)


def get_zoom_options(config, zoom):
    for options_item in config['layers']:
        if zoom in options_item['zoom']:
            return options_item


def build_replace_map(db, options):
    replace_map = {}
    for values in [db, options]:
        for key in values:
            replace_map[key] = str(values[key])

    return replace_map


def generate_temp_filename():
    length = 10
    letters = string.ascii_lowercase
    filename = ''.join(random.choice(letters) for i in range(length))

    return 'tmp/%s.tmp.xml' % filename


def generate_map_file(tmpl, db, options):
    file = open(tmpl)
    content = file.read()
    file.close()

    replace_map = build_replace_map(db, options)

    for key in replace_map:
        content = content.replace('%%%s%%' % key.upper(), replace_map[key])

    output_filename = generate_temp_filename()
    output_file = open(output_filename, 'w')
    output_file.write(content)
    output_file.close()

    return output_filename


if __name__ == '__main__':
    config = get_config()

    template_file = config['map']['template']
    tile_dir = config['map']['tile_dir']
    db = config['db']
    bbox = config['map']['bbox']
    minZoom = config['map']['zoom']['min']
    maxZoom = config['map']['zoom']['max']

    for zoom in range(minZoom, maxZoom):
        map_file = generate_map_file(template_file, db, get_zoom_options(config, zoom))
        render_tiles(bbox, map_file, tile_dir, zoom, zoom)
        os.remove(map_file)
