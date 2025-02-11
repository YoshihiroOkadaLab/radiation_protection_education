import * as THREE from "three";

export class ClippingPlanesObject {
    // ==================================================
    // Type Declaration
    id: number;
    planes: THREE.Plane[];
    enabled: boolean;
    intersection: boolean;
    invert: boolean;
    isType?: string;

    // ==================================================
    // Constructor
    constructor(
        id: number,
        planes: THREE.Plane[],
        enabled: boolean,
        intersection: boolean,
        invert: boolean,
        isType?: string
    ) {
        this.id = id;
        this.planes = planes;
        this.enabled = enabled;
        this.intersection = intersection;
        this.invert = invert;
        isType ? (this.isType = isType) : null;
    }
}

/**
 * @link https://github.com/mrdoob/three.js/blob/master/examples/webgl2_materials_texture3d.html
 * @link https://github.com/mrdoob/three.js/blob/master/src/objects/Mesh.js
 *
 * @abstract Volume Base
 */
class VolumeBase extends THREE.Object3D {
    // ==================================================
    // Type Declaration
    isDose: boolean;
    isPerspective: boolean;

    _coefficient: number; // multiply coefficient and volume.data
    _offset: number; // add offset and volume.data

    // --------------------------------------------------
    // Volume Parameter
    _opacity: number;
    _clim1: number;
    _clim2: number;
    _colormap: string;
    _renderstyle: string;
    _isothreshold: number;

    // --------------------------------------------------
    // Clipping
    _clipping: boolean;
    _clippingPlanes: THREE.Plane[];
    _clipIntersection: boolean;

    _clippedInitValue: boolean[];
    _clippingPlanesRegion: number[];
    _clippedInvert: boolean[];
    _clippingPlanesObject: ClippingPlanesObject | undefined;
    // -> [...parent.ClippingPlanesObject[], ...this.ClippingPlanesObject[]]

    parentId: string | undefined;
    parentRegionOffset: number;
    planesLength: number;
    clippingPlanesObjects: ClippingPlanesObject[];
    totalClippingPlanesObjects: ClippingPlanesObject[];

    // --------------------------------------------------
    // Board (use only then isDose is true)
    _boardEffect: boolean;
    _boardCoefficient: number;
    _boardOffset: number;
    _clippingPlanesIsBoard: boolean[];

    // --------------------------------------------------
    // Auto update
    volumeParamAutoUpdate: boolean;
    volumeClippingAutoUpdate: boolean;

    coefficientAutoUpdate: boolean;
    offsetAutoUpdate: boolean;
    opacityAutoUpdate: boolean;
    clim1AutoUpdate: boolean;
    clim2AutoUpdate: boolean;
    colormapAutoUpdate: boolean;
    renderstyleAutoUpdate: boolean;
    isothresholdAutoUpdate: boolean;

    boardCoefficientAutoUpdate: boolean;
    boardOffsetAutoUpdate: boolean;

    volumeParamWorldAutoUpdate: boolean;
    volumeClippingWorldAutoUpdate: boolean;

    // ==================================================
    // Constructor
    constructor(isDose = false, isPerspective = false) {
        super();

        this.isDose = isDose;
        this.isPerspective = isPerspective;

        this._coefficient = 1.0;
        this._offset = 0.0;

        this._opacity = 1.0;
        this._clim1 = 0;
        this._clim2 = 1;
        this._colormap = "viridis";
        this._renderstyle = "mip";
        this._isothreshold = 0.1;

        this._clipping = false;
        this._clippingPlanes = [];
        this._clipIntersection = false;

        this._clippedInitValue = [];
        this._clippingPlanesRegion = [];
        this._clippedInvert = [];

        this.parentRegionOffset = 0;
        this.planesLength = 0;
        this.clippingPlanesObjects = [];
        this.totalClippingPlanesObjects = [];

        this._boardEffect = false;
        this._boardCoefficient = 0.01;
        this._boardOffset = 0.0;
        this._clippingPlanesIsBoard = [];

        this.volumeParamAutoUpdate = true;
        this.volumeClippingAutoUpdate = true;

        this.coefficientAutoUpdate = true;
        this.offsetAutoUpdate = true;
        this.opacityAutoUpdate = true;
        this.clim1AutoUpdate = true;
        this.clim2AutoUpdate = true;
        this.colormapAutoUpdate = true;
        this.renderstyleAutoUpdate = true;
        this.isothresholdAutoUpdate = true;

        this.boardCoefficientAutoUpdate = true;
        this.boardOffsetAutoUpdate = true;

        this.volumeParamWorldAutoUpdate = true;
        this.volumeClippingWorldAutoUpdate = true;
    }

    // ==================================================
    // Getter, Setter
    get coefficient() {
        return this._coefficient;
    }
    set coefficient(coefficient: number) {
        this._coefficient = coefficient;
        this.updateVolumeParam(false, true);
    }
    get offset() {
        return this._offset;
    }
    set offset(offset: number) {
        this._offset = offset;
        this.updateVolumeParam(false, true);
    }

    get opacity() {
        return this._opacity;
    }
    set opacity(opacity: number) {
        this._opacity = opacity;
        this.updateVolumeParam(false, true);
    }
    get clim1() {
        return this._clim1;
    }
    set clim1(clim1: number) {
        this._clim1 = clim1;
        this.updateVolumeParam(false, true);
    }
    get clim2() {
        return this._clim2;
    }
    set clim2(clim2: number) {
        this._clim2 = clim2;
        this.updateVolumeParam(false, true);
    }

    get colormap() {
        return this._colormap;
    }
    set colormap(colormap: string) {
        this._colormap = colormap;
        this.updateVolumeParam(false, true);
    }

    get renderstyle() {
        return this._renderstyle;
    }
    set renderstyle(renderstyle: string) {
        this._renderstyle = renderstyle;
        this.updateVolumeParam(false, true);
    }

    get isothreshold() {
        return this._isothreshold;
    }
    set isothreshold(isothreshold: number) {
        this._isothreshold = isothreshold;
        this.updateVolumeParam(false, true);
    }

    get clipping() {
        return this._clipping;
    }
    set clipping(clipping: boolean) {
        this._clipping = clipping;
        this._clippingPlanesObject
            ? (this._clippingPlanesObject.enabled = clipping)
            : null;
        this.updateVolumeClipping(false, true);
    }
    get clippingPlanes() {
        return this._clippingPlanes;
    }
    set clippingPlanes(planes: THREE.Plane[]) {
        this._clippingPlanes = planes;
        this._clippingPlanesObject
            ? (this._clippingPlanesObject.planes = planes)
            : null;
        this.updateVolumeClipping(false, true);
    }
    get clipIntersection() {
        return this._clipIntersection;
    }
    set clipIntersection(clipIntersection: boolean) {
        this._clipIntersection = clipIntersection;
        this._clippingPlanesObject
            ? (this._clippingPlanesObject.intersection = clipIntersection)
            : null;
        this.updateVolumeClipping(false, true);
    }

    get boardEffect() {
        return this._boardEffect;
    }
    set boardEffect(boardEffect: boolean) {
        this._boardEffect = boardEffect;
        console.log(boardEffect);
        this.updateVolumeClipping(false, true);
    }
    get boardCoefficient() {
        return this._boardCoefficient;
    }
    set boardCoefficient(coefficient: number) {
        this._boardCoefficient = coefficient;
        this.updateVolumeParam(false, true);
    }
    get boardOffset() {
        return this._boardOffset;
    }
    set boardOffset(offset: number) {
        this._boardOffset = offset;
        this.updateVolumeParam(false, true);
    }

    // ==================================================
    // Method
    pushClippingPlanesObjects(clippingPlanesObject: ClippingPlanesObject) {
        let index = this.clippingPlanesObjects.length;
        clippingPlanesObject.id = index;

        this.clippingPlanesObjects.push(clippingPlanesObject);
        this.updateVolumeClipping(false, true);
    }

    // https://github.com/mrdoob/three.js/blob/master/src/core/Object3D.js#L601
    updateVolumeParam(updateParents: boolean, updateChildren: boolean) {
        // =========================
        // update parent
        const parent = this.parent;
        if (
            updateParents === true &&
            parent !== null &&
            this.volumeParamWorldAutoUpdate
        ) {
            if (parent instanceof VolumeBase) {
                parent.updateVolumeParam(true, false);
            }
        }

        // =========================
        // update this by parent
        if (parent !== null && this.volumeParamAutoUpdate) {
            if (parent instanceof VolumeBase) {
                this.coefficientAutoUpdate
                    ? (this._coefficient = parent._coefficient)
                    : null;
                this.offsetAutoUpdate ? (this._offset = parent._offset) : null;
                this.opacityAutoUpdate
                    ? (this._opacity = parent._opacity)
                    : null;
                this.clim1AutoUpdate ? (this._clim1 = parent._clim1) : null;
                this.clim2AutoUpdate ? (this._clim2 = parent._clim2) : null;
                this.colormapAutoUpdate
                    ? (this._colormap = parent._colormap)
                    : null;
                this.renderstyleAutoUpdate
                    ? (this._renderstyle = parent._renderstyle)
                    : null;
                this.isothresholdAutoUpdate
                    ? (this._isothreshold = parent._isothreshold)
                    : null;

                if (parent.isDose) {
                    this.boardCoefficientAutoUpdate
                        ? (this._boardCoefficient = parent._boardCoefficient)
                        : null;
                    this.boardOffsetAutoUpdate
                        ? (this._boardOffset = parent._boardOffset)
                        : null;
                }
            }
        }

        // =========================
        // update children
        if (updateChildren === true) {
            const children = this.children;

            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (
                    child instanceof VolumeBase &&
                    child.volumeParamWorldAutoUpdate === true
                ) {
                    child.updateVolumeParam(false, true);
                }
            }
        }
    }

    updateVolumeClipping(updateParents: boolean, updateChildren: boolean) {
        // =========================
        // update parent
        const parent = this.parent;
        if (
            updateParents &&
            parent !== null &&
            this.volumeClippingWorldAutoUpdate
        ) {
            if (parent instanceof VolumeBase) {
                parent.updateVolumeClipping(true, false);
            }
        }

        // =========================
        // reset this values
        this.planesLength = 0;
        this.parentRegionOffset = 0;

        this._clipping = false;
        this._clippingPlanes = [];
        this._clipIntersection = false;

        this._clippedInitValue = [];
        this._clippingPlanesRegion = [];
        this._clippedInvert = [];
        this._clippingPlanesIsBoard = [];

        this.totalClippingPlanesObjects = [];

        // =========================
        // update this by parent
        if (
            parent !== null &&
            this.volumeClippingAutoUpdate &&
            parent instanceof VolumeBase
        ) {
            this._clipping = parent._clipping;
            this._clippingPlanes = parent._clipping
                ? parent._clippingPlanes.concat()
                : [];
            this._clipIntersection = parent._clipIntersection;

            this._clippedInitValue = parent._clipping
                ? parent._clippedInitValue.concat()
                : [];
            this._clippingPlanesRegion = parent._clipping
                ? parent._clippingPlanesRegion.concat()
                : [];
            this._clippedInvert = parent._clipping
                ? parent._clippedInvert.concat()
                : [];

            this.totalClippingPlanesObjects = parent._clipping
                ? parent.totalClippingPlanesObjects.concat()
                : [];

            this.parentRegionOffset = parent._clipping
                ? parent._clippingPlanesRegion.reduce(
                      (a, b) => Math.max(a, b),
                      -1
                  ) + 1
                : 0;

            this._boardEffect = parent._boardEffect;

            this._clippingPlanesIsBoard = parent.clipping
                ? parent._clippingPlanesIsBoard.concat()
                : [];
            if (parent.isDose) {
            }
        }

        // =========================
        // update this
        let numEnableElement = 0;
        for (let i = 0; i < this.clippingPlanesObjects.length; i++) {
            let element = this.clippingPlanesObjects[i];

            // Clipping
            this._clipping = this._clipping || element.enabled;

            if (element.enabled) {
                // Planes
                this._clippingPlanes = this._clippingPlanes.concat(
                    element.planes
                );
                this.planesLength += element.planes.length;

                // Intersection
                this._clipIntersection =
                    this._clipIntersection || element.intersection;

                // Region
                let regionArray = new Array(element.planes.length).fill(
                    i + this.parentRegionOffset
                );
                this._clippingPlanesRegion =
                    this._clippingPlanesRegion.concat(regionArray);

                numEnableElement += 1;
            }
        }

        // Init Value
        let initValueArray = new Array(this.planesLength).fill(false);
        this._clippedInitValue = this._clippedInitValue.concat(initValueArray);

        for (let i = 0; i < this.parentRegionOffset; i++) {
            this._clippedInitValue[i] = this._clipIntersection;
        }

        // Invert
        let invertArray = new Array(this.planesLength).fill(false);
        this._clippedInvert = this._clippedInvert.concat(invertArray);

        // isBoard
        let isBoardArray = new Array(this.planesLength).fill(false);
        this._clippingPlanesIsBoard =
            this._clippingPlanesIsBoard.concat(isBoardArray);

        // set Init Value, Invert
        for (let i = 0; i < this.clippingPlanesObjects.length; i++) {
            let element = this.clippingPlanesObjects[i];

            this._clippedInitValue[i + this.parentRegionOffset] =
                this._clipIntersection && element.enabled;
            this._clippedInvert[i + this.parentRegionOffset] = element.invert;
            this._clippingPlanesIsBoard[i + this.parentRegionOffset] =
                element.isType === "board";
        }

        // update totalClippingPlanesObjects
        this.totalClippingPlanesObjects =
            this.totalClippingPlanesObjects.concat(this.clippingPlanesObjects);

        // =========================
        // update children
        if (updateChildren) {
            const children = this.children;

            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (
                    child instanceof VolumeBase &&
                    child.volumeClippingWorldAutoUpdate
                ) {
                    child.updateVolumeClipping(false, true);
                }
            }
        }
    }

    getVolumeValue(position: THREE.Vector3): number {
        return NaN;
    }
}

export { VolumeBase };
