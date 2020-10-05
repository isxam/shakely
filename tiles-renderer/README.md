# Tiles renderer

Tool to generate tiles of data-layer with road surface quality.

## Requirements
- `mapnik`
- `yaml`

## How to use
1. Copy `config/config.yaml.dist` to `config/config.yaml`
2. Set database configs into `config/config.yaml` (and update any other configs)
3. Run `python main.py`
4. Tiles will be generated in specified `tile_dir`
