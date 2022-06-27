import { Vect2D } from "./Vect2D";

export interface IFieldOfView {
    origin: Vect2D;
    orientation: number;
    heading: Vect2D;
    angle: number; // In Degree
    fovLength: number;
}

export class MyMath {
    public static isPointInRectangle(topLeftCorner: Vect2D, bottomRightCorner: Vect2D, point: Vect2D) {
        return (point.x >= topLeftCorner.x
            && point.x <= bottomRightCorner.x
            && point.y >= topLeftCorner.y
            && point.y <= bottomRightCorner.y);
    }

     // Return the mean of an array
     public static mean(array: number[]): number | null{
        if (array.length === 0)
            return null;

        var sum = array.reduce(function(a, b) { return a + b; });
        var avg = sum / array.length;
        return avg;
    }

    public static getDirectionFromAngle(angle: number): Vect2D {
        const rad = angle * Math.PI / 180;
        const vx = Math.cos(rad);
        const vy = Math.sin(rad);
        return new Vect2D(vx, vy);
    }

    // Return the cardinal direction the target is placed from the center
    // 0: North, 1: North East, 2: East, ....
    public static getCardinalDirection(center: Vect2D, direction: Vect2D, target: Vect2D): number {
        const ship = direction;
        ship.normalize();

        const toTargetVector = new Vect2D(target.x - center.x, target.y - center.y);
        toTargetVector.normalize();

        const angleDeg = toTargetVector.angleWithVector(direction) * 180 / Math.PI; // wwith normalized vector
        return Math.round(-angleDeg);
    }

    public static radianToDegree(angle: number): number {
        return (angle * 180) / Math.PI;
    }

    public static degreeToRadian(angle: number): number {
        return (angle * Math.PI) / 180.0;
    }

    public static isInFieldOfView(fov: IFieldOfView, targetPosition: Vect2D): boolean {
        /*
        Move back the origin of the fov behind of the ship
        const deltaBehindY = Math.sin((fov.orientation + 180) * Math.PI / 180) * fov.radius;
        const deltaBehindX = Math.cos((fov.orientation + 180) * Math.PI / 180) * fov.radius;
        const xShip = fov.pos.x + deltaBehindX ;
        const yShip = fov.pos.y + deltaBehindY ;
        const posBehindShip = new Vect2D(xShip, yShip);
        */

        // Compare angle between heading and target with field of view angle
        const vShipTarget = Vect2D.sub(targetPosition, fov.origin);
        const distance = vShipTarget.norm;
        if (distance > fov.fovLength) {
            return false;
        }

        vShipTarget.normalize();
        const dotProduct = fov.heading.dotProduct(vShipTarget);
        const cosHalfFov = Math.cos((fov.angle / 2) * Math.PI / 180);
        return dotProduct > cosHalfFov;
    }
}