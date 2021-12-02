
import * as cc from 'cc';
const { ccclass, property } = cc._decorator;


/**
 * Predefined variables
 * Name = SlimeScript
 * DateTime = Sun Nov 28 2021 18:45:51 GMT-0600 (北美中部标准时间)
 * Author = Kaicheng
 * FileBasename = SlimeScript.ts
 * FileBasenameNoExtension = SlimeScript
 * URL = db://assets/script/SlimeScript.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/en/
 *
 */
 
@ccclass('SlimeScript')
export class SlimeScript extends cc.Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    player = null;

    horizontalStep: number;
    maxDistance: number;
    maxVerticalDistance: number;

    rigidBody: cc.RigidBody2D;
    collider: cc.Collider2D;
    uiTransform: cc.UITransform;

    // sprint
    sprintToRight: boolean;
    sprintStep: number;
    curSprintTime: number;
    maxSprintTime: number;
    attackDistance: number;

    allowSprint: boolean;
    sprintCB: number;
    curCBtime: number;


    onLoad() {
        this.player = cc.find("Canvas/Map/Player");

        this.horizontalStep = 3;
        this.maxDistance = 50;
        this.maxVerticalDistance = 180;

        this.rigidBody = this.getComponent(cc.RigidBody2D);
        this.collider = this.getComponent(cc.Collider2D);
        this.uiTransform = this.getComponent(cc.UITransform);

        this.sprintToRight = true;
        this.sprintStep = 25;
        this.curSprintTime = 0;
        this.maxSprintTime = 0.25;
        this.attackDistance = 110;

        this.allowSprint = true;
        this.sprintCB = 2;
        this.curCBtime = 0;

    }

    start () {
        if (this.collider) {
            this.collider.on(cc.Contact2DType.POST_SOLVE, this.onPostSolve, this);
        }
    }

    onPostSolve (selfCollider: cc.Collider2D, otherCollider: cc.Collider2D, contact: cc.IPhysics2DContact) {
        if (otherCollider.name == "Player") {
            this.curSprintTime = 0;
        }
    }

    reSetcurCBtime () {
        this.curCBtime = Math.min(this.curCBtime + 0.5, this.sprintCB);
    }

    update (deltaTime: number) {
        console.log(this.curSprintTime);
        let velocity: cc.Vec2 = this.rigidBody.linearVelocity;
        let playerwidth: number = this.player.getComponent(cc.UITransform).contentSize.width;
        let enemywidth: number = this.uiTransform.contentSize.width;
        let distanceBetween: number = (this.player.position.x + playerwidth / 2) - (this.node.position.x + enemywidth / 2);
        let verticalDistance: number = Math.abs(this.player.position.y - this.node.position.y);
        this.curCBtime = Math.max(this.curCBtime - deltaTime, 0);
        
        if (Math.abs(distanceBetween) < this.attackDistance && this.curSprintTime == 0 && this.curCBtime == 0 && verticalDistance < this.maxVerticalDistance) {
            if (distanceBetween > 0) {
                this.sprintToRight = true;
            } else {
                this.sprintToRight = false;
            }
            this.curSprintTime = this.maxSprintTime;
            this.curCBtime = this.sprintCB;
        }

        if (this.curSprintTime > 0) {
            if (this.sprintToRight) {
                velocity.x = this.sprintStep
            } else {
                velocity.x = - this.sprintStep;
            }
            this.curSprintTime = Math.max(this.curSprintTime - deltaTime, 0);
        } else if (verticalDistance > this.maxVerticalDistance) {
            velocity.x = 0;
        } else {
            if (distanceBetween > this.maxDistance) {
                velocity.x = this.horizontalStep;
            } else if (distanceBetween < -this.maxDistance) {
                velocity.x = -this.horizontalStep;
            } else {
                velocity.x = 0;
            }
        }
        this.rigidBody.linearVelocity = velocity;
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.3/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.3/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.3/manual/en/scripting/life-cycle-callbacks.html
 */