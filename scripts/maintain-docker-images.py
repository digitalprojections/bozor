#!/usr/bin/env python3
"""Preview or remove images unreferenced by any Docker container. Tool v1.0.0."""
import argparse
import json
import subprocess


def docker(*args):
    return subprocess.check_output(['docker', *args], text=True).strip()


def inventory():
    container_ids = docker('container', 'ls', '-aq').split()
    containers = json.loads(docker('container', 'inspect', *container_ids)) if container_ids else []
    used = {container['Image'] for container in containers}
    image_ids = sorted(set(docker('image', 'ls', '-aq', '--no-trunc').split()))
    images = json.loads(docker('image', 'inspect', *image_ids)) if image_ids else []
    return used, images


def plan(used, images):
    return sorted([
        {key: image.get(key) for key in ('Id', 'RepoTags', 'Created', 'Size')}
        for image in images if image['Id'] not in used
    ], key=lambda image: image['Created'])


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--apply', action='store_true', help='Remove previewed unused images without force.')
    args = parser.parse_args()
    used, images = inventory()
    candidates = plan(used, images)
    print(json.dumps({'tool_version': '1.0.0', 'mode': 'apply' if args.apply else 'preview',
                      'protected_image_ids': sorted(used), 'unused_images': candidates}, indent=2), flush=True)
    if args.apply:
        for candidate in candidates:
            # Recheck every container, including stopped containers, immediately before removal.
            current_used, current_images = inventory()
            if candidate['Id'] in current_used:
                raise RuntimeError('An image became referenced by a container; cleanup stopped.')
            current = next((image for image in current_images if image['Id'] == candidate['Id']), None)
            if current is None or current.get('RepoTags') != candidate['RepoTags']:
                raise RuntimeError('The image inventory changed; preview cleanup again.')
            print(docker('image', 'rm', candidate['Id']), flush=True)
        after_used, after_images = inventory()
        if after_used != used or not used.issubset({image['Id'] for image in after_images}):
            raise RuntimeError('Container image references changed during cleanup.')
        print(json.dumps({'remaining_unused_images': plan(after_used, after_images)}, indent=2))
    print(docker('system', 'df'))


if __name__ == '__main__':
    main()
