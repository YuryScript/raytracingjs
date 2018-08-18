﻿'use strict';

class Color {
	constructor(r = 0, g = 0, b = 0){
		this.r = r;
		this.g = g;
		this.b = b;
		this.check();
	}
	
	toVector(){
		return new Vector(
			this.r,
			this.g,
			this.b,
		);
	}
	
	check(){
		this.r = (this.r > 255) ? 255 : (this.r < 0) ? 0 : this.r;
		this.g = (this.g > 255) ? 255 : (this.g < 0) ? 0 : this.g;
		this.b = (this.b > 255) ? 255 : (this.b < 0) ? 0 : this.b;
	}
	
	static multiply(color, k) {
		var result = new Color(
			color.r * k,
			color.g * k,
			color.b * k,
		);
		result.check();
		return result;
	}
	
	static add(color1, color2) {
		var result = new Color(
			color1.r + color2.r,
			color1.g + color2.g,
			color1.b + color2.b,
		);
		result.check();
		return result;
	}
	
	static multiplyVector(color, vector) {
		var result = new Color(
			color.r * vector.v1,
			color.g * vector.v2,
			color.b * vector.v3,
		);
		result.check();
		return result;
	}
	
	static average(color1, color2){
		return new Color(
			(color1.r + color2.r) / 2,
			(color1.g + color2.g) / 2,
			(color1.b + color2.b) / 2,
		);
	}
}

class Vector {
	constructor(v1 = 0, v2 = 0, v3 = 0){
		this.v1 = v1;
		this.v2 = v2;
		this.v3 = v3;
	}
	
	toColor() {
		return new Color(
			this.v1,
			this.v2,
			this.v3,
		);
	}
	
	toPosition() {
		return new Position(
			this.v1,
			this.v2,
			this.v3,
		);
	}
	
	static dotProduct(vector1, vector2){
		// скалярное произведение
		return vector1.v1 * vector2.v1 + vector1.v2 * vector2.v2 + vector1.v3 * vector2.v3;	
	}
	
	static multiply(vector, k) {
		// умножение на число
		return new Vector(
			vector.v1 * k,
			vector.v2 * k,
			vector.v3 * k,
		);
	}
	
	static divide(vector, k) {
		// деление на число
		return new Vector(
			vector.v1 / k,
			vector.v2 / k,
			vector.v3 / k,
		);
	}
	
	static add(vector1, vector2) {
		// сложение
		return new Vector(
			vector1.v1 + vector2.v1,
			vector1.v2 + vector2.v2,
			vector1.v3 + vector2.v3,
		);
	}

	static subtract(vector1, vector2) {
		// вычитание
		return new Vector(
			vector1.v1 - vector2.v1,
			vector1.v2 - vector2.v2,
			vector1.v3 - vector2.v3,
		);
	}
	
	length(){
		// длина вектора
		return Math.sqrt(Vector.dotProduct(this, this));
	}
}

class Position {
	constructor(x = 0, y = 0, z = 0){
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	toVector(){
		return new Vector(
			this.x,
			this.y,
			this.z,
		);
	}
}

class Camera {
	constructor(position = new Position(), viewportWidth = 1, viewportHeight = 1, distanse = 1){
		this.position = position;
		this.viewportWidth = viewportWidth;
		this.viewportHeight = viewportHeight;
		this.distanse = distanse;
		this.rotation = [
			[1, 0, 0],
			[0, 1, -0.5],
			[0, 0, 1]
		];
	}
}

class Sphere {
	constructor(position = new Position(), radius = 1, color = new Color(), specularity = 0, reflectivity = 0){
		this.position = position;
		this.radius = radius;
		this.color = color;
		this.specularity = specularity;
		this.reflectivity = reflectivity;
	}
}

class LightAmbient {
	constructor(intensity = new Vector(1, 1, 1)){
		this.intensity = intensity;
	}
}

class LightPoint {
	constructor(position = new Position(), intensity = new Vector(1, 1, 1)){
		this.position = position;
		this.intensity = intensity;
	}
}

class LightDirectional {
	constructor(intensity = new Vector(1, 1, 1), direction = new Vector(0, 0, 0)){
		this.intensity = intensity;
		this.direction = direction;
	}
}

class Renderer {
	constructor(canvas, scene = {}){
		this.camera = new Camera(new Position(0, 4, -6), document.documentElement.clientWidth / document.documentElement.clientHeight, 1);
		
		this.canvas = canvas;
		this.canvasContext = this.canvas.getContext('2d');
		this.canvasBuffer = this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
		this.canvasPitch = this.canvasBuffer.width * 4;
		
		this.backgroundColor = new Color(0, 0, 0);
		
		this.scene = scene;
		
		this.scene.sphere = {};
		this.scene.sphere.a = new Sphere(new Position(0, 0, 5), 1, new Color(255, 0, 0), 1000, 0.5);
		this.scene.sphere.b = new Sphere(new Position(-2, 0, 4), 1, new Color(0, 255, 0), 1000, 0.4);
		this.scene.sphere.c = new Sphere(new Position(3, 0, 4), 1, new Color(0, 0, 255), 1000, 0);
		this.scene.sphere.f = new Sphere(new Position(0, 0, 2), 1, new Color(255, 255, 255), 1000, 1);
		this.scene.sphere.g = new Sphere(new Position(-1.7, 0-0.5, 1.8), 0.5, new Color(226, 66, 244), 1000, 0);
		this.scene.sphere.h = new Sphere(new Position(0, 0-0.4, 0), 0.6, new Color(255, 191, 0), 1000, 0.6);
		this.scene.sphere.j = new Sphere(new Position(2.3, 0-0.6, 2), 0.6, new Color(27, 173, 98), 1000, 0.4);
		this.scene.sphere.d = new Sphere(new Position(0, -5001, 0), 5000, new Color(255, 255, 255), 1000, 0);
		
		this.scene.light = {};
		this.scene.light.a = new LightAmbient(new Vector(0.1, 0.1, 0.1));
		this.scene.light.b = new LightDirectional(new Vector(1, 1, 1), new Vector(2, 3, -2));
		//this.scene.light.c = new LightPoint(new Position(0, 3, 2), new Vector(0.6, 0.6, 0.6));
		
		this.rayCount = 0;
		this.epsilon = 1e-3;
		this.supersampling = 1;
		this.recursionDepth = 3;
		
		this.canvasContext.putPixel = (x, y, color) => {
			if(x < 0 || y < 0 || x >= this.canvas.width || y >= this.canvas.height){
				return;
			}
			var offset = 4 * x + this.canvasPitch * y;
			this.canvasBuffer.data[offset++] = color.r;
			this.canvasBuffer.data[offset++] = color.g;
			this.canvasBuffer.data[offset++] = color.b;
			this.canvasBuffer.data[offset] = 255; // Alpha = 255 (полная не прозрачность)
		};
		
		this.draw();
	}
	
	canvasToViewport(canvasX, canvasY){
		return new Vector(
			(canvasX - this.canvas.width / 2) * this.camera.viewportWidth / this.canvas.width,
			-(canvasY - this.canvas.height / 2) * this.camera.viewportHeight / this.canvas.height,
			this.camera.distanse,
		);
	}
	
	multiplyMV(matrix, vector) {
		var vector = [vector.v1, vector.v2, vector.v3];
		var result = [0,0,0];
		for(let i = 0; i < 3; i++){
			for(let j = 0; j < 3; j++){
				result[i] += vector[j] * matrix[i][j];
			}
		}
		return new Vector(result[0], result[1], result[2]);
	}
	
	traceRay(origin, direction, tMin, tMax, recursionDepth) {
		this.rayCount++;
		var intersection = this.closestIntersection(origin, direction, tMin, tMax);
		var closestSphere = intersection.closestSphere;
		var closestT = intersection.closestT;
		
		if(!closestSphere){
			return this.backgroundColor;
		}
		
		var point = Vector.add(origin, Vector.multiply(direction, closestT));
		var normal = Vector.subtract(point, closestSphere.position.toVector());
		normal = Vector.divide(normal, normal.length());
		
		var view = Vector.multiply(direction, -1);
		var lighting = this.computeLighting(point, normal, view, closestSphere.specularity);
		var localColor = Color.multiplyVector(closestSphere.color, lighting);
		
		if(closestSphere.reflectivity <= 0 || recursionDepth <= 0){
			return localColor;
		}
		
		var reflectedRay = this.reflectRay(view, normal);
		var reflectedColor = this.traceRay(point, reflectedRay, this.epsilon, Infinity, recursionDepth - 1);
		
		return Color.add(Color.multiply(localColor, 1 - closestSphere.reflectivity),
			Color.multiply(reflectedColor, closestSphere.reflectivity));
	}
	
	closestIntersection(origin, direction, tMin, tMax) {
		var closestT = Infinity;
		var closestSphere = null;
		for(let x in this.scene.sphere){
			var tmp = this.intersectRaySphere(origin, direction, this.scene.sphere[x]);
			if(tmp.t1 > tMin && tmp.t1 < tMax && tmp.t1 < closestT){
				closestT = tmp.t1;
				closestSphere = this.scene.sphere[x];
			}
			if(tmp.t2 > tMin && tmp.t2 < tMax && tmp.t2 < closestT){
				closestT = tmp.t2;
				closestSphere = this.scene.sphere[x];
			}
		}
		return {
			closestSphere: closestSphere,
			closestT: closestT,
		};
	}
	
	intersectRaySphere(origin, direction, sphere) {
		var radius = sphere.radius;
		var vector = Vector.subtract(origin, sphere.position.toVector());
		
		var a = Vector.dotProduct(direction, direction);
		var b = 2 * Vector.dotProduct(vector, direction);
		var c = Vector.dotProduct(vector, vector) - radius * radius;
		
		var discriminant = b * b - 4 * a * c;
		if(discriminant < 0){
			return {
				t1: Infinity,
				t2: Infinity,
			};
		}

		var t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
		var t2 = (-b - Math.sqrt(discriminant)) / (2 * a);
		return {
			t1: t1,
			t2: t2,
		};
	}
	
	computeLighting(point, normal, view, specularity){
		var intensity = new Vector(0, 0, 0);
		for(let x in this.scene.light){
			if(this.scene.light[x] instanceof LightAmbient){
				intensity = Vector.add(intensity, this.scene.light[x].intensity);
			} else {
				let L, tMax;
				if(this.scene.light[x] instanceof LightPoint){
					L = Vector.subtract(this.scene.light[x].position.toVector(), point);
					tMax = 1;
				}
				else { // LightDirectional
					L = this.scene.light[x].direction;
					tMax = Infinity;
				}
				// тени/shadows
				let blocker = this.closestIntersection(point, L, this.epsilon, tMax);
				if (blocker.closestSphere) {
					continue;
				}
				// диффузность/diffuse reflection
				let NormalDotL = Vector.dotProduct(normal, L);
				if(NormalDotL > 0){
					intensity = Vector.add(intensity, Vector.multiply(this.scene.light[x].intensity, NormalDotL / (normal.length() * L.length()) ) );
				}
				// зеркальность/specular reflection
				if (specularity != -1) {
					let R = this.reflectRay(L, normal);
					let RDotV = Vector.dotProduct(R, view);
					if (RDotV > 0) {
						let tmp = Math.pow(RDotV / (R.length() * view.length()), specularity);
						intensity = Vector.add(intensity, Vector.multiply(this.scene.light[x].intensity, tmp));
					}
				}
				
			}
		}
		return intensity;
	}
	
	reflectRay(vector1, vector2){
		return Vector.subtract(Vector.multiply(vector2, 2 * Vector.dotProduct(vector1, vector2)), vector1);
	}
	
	updateCanvas(){
		this.canvasContext.putImageData(this.canvasBuffer, 0, 0);
	}
	
	draw() {
		console.time('bench');
		for(let x = 0; x < this.canvas.width; x++){
			for(let y = 0; y < this.canvas.height; y++){
				var color;
				// сглаживание/supersampling
				if(this.supersampling > 1){
					for(let i = 0; i < this.supersampling; i++){
						let X = x + (1 / this.supersampling) * i;
						for(let j = 0; j < this.supersampling; j++){
							let Y = y + (1 / this.supersampling) * j;
							let direction = this.canvasToViewport(X, Y);
							direction = this.multiplyMV(this.camera.rotation, direction);
							if(i == 0 && j == 0) {
								color = this.traceRay(this.camera.position.toVector(), direction, this.camera.distanse, Infinity, this.recursionDepth);
							}
							else {
								let colorTmp = this.traceRay(this.camera.position.toVector(), direction, this.camera.distanse, Infinity, this.recursionDepth);
								color = Color.average(color, colorTmp);
							}
						}
					}
				}
				else {
					let direction = this.canvasToViewport(x, y);
					direction = this.multiplyMV(this.camera.rotation, direction);
					color = this.traceRay(this.camera.position.toVector(), direction, this.camera.distanse, Infinity, this.recursionDepth);
				}
				this.canvasContext.putPixel(x, y, color);
			}
		}
		this.updateCanvas();
		console.timeEnd('bench');
		console.log(this.rayCount.toLocaleString(), 'rays');
	}
}

window.onload = () => {
	const canvas = document.getElementById('canvas');
	//canvas.width = 10;
	//canvas.height = 10;
	canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
	const raytracing = new Renderer(canvas);
}