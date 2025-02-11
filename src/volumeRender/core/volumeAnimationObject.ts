import * as THREE from "three";

import { VolumeGroup } from "./volumeGroup";

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 *
 * @abstract Core
 * @param volume any
 * @param clim1 number, Default 0
 * @param clim2 number, Default 1
 * @param colormap string, Default viridis
 * @param renderstyle string, Default mip
 * @param isothreshold number, Default 0.1
 * @param clipping boolean, Default false
 * @param planes THREE.Plane
 */
class VolumeAnimationObject extends VolumeGroup {
    // ==================================================
    // Type Declaration
    volumeAnimationParamAutoUpdate: boolean;
    childrenLength: number;
    // animation index
    index: number;

    // ==================================================
    // Constructor
    constructor(isDose = false) {
        super(isDose);

        this.volumeAnimationParamAutoUpdate = true;
        this.childrenLength = 0;
        this.index = 0;

        this.type = "Group";
    }

    // ==================================================
    // Method
    add(...object: THREE.Object3D<Event>[]) {
        super.add(...object);
        this.updateAnimation();

        return this;
    }
    // TODO: support remove

    updateAnimation() {
        this.children.map((object, i) => (object.visible = false));
        this.childrenLength = this.children.length;
        const indexArray = [...Array(this.childrenLength)].map((_, i) => i);

        // Ref: https://qiita.com/suin/items/1b39ce57dd660f12f34b
        const _track = [...Array(this.childrenLength)].map(
            (_, i) =>
                new THREE.BooleanKeyframeTrack(
                    `.children[${i}].visible`,
                    indexArray,
                    [...Array(this.childrenLength)].map((_, j) =>
                        i === j ? true : false
                    )
                )
        );

        this.animations = [
            new THREE.AnimationClip(
                "volumeAnimation",
                this.childrenLength,
                _track
            ),
        ];
    }

    getVolumeValueByIndex(position: THREE.Vector3): number {
        let values = this.getVolumeValues(position);

        return values[this.index];
    }
}

export { VolumeAnimationObject };
