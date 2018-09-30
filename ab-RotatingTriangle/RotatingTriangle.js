﻿// RotatedTranslatedTriangle.js
// Vertex shader program
var VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform mat4 u_ModelMatrix;\n' +
    'void main() {\n' +
    ' gl_Position = u_ModelMatrix * a_Position;\n' +
    '}\n';

// Fragment shader program
var FSHADER_SOURCE =
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
    '}\n';


var ANGLE_STEP = 45.0;

function main() {
    //Retreive <canvas>
    var canvas = document.getElementById('webgl');

    //get rendering context
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    //Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initalize shaders');
        return;
    }

    //write the positions of vertices to a vertex shader
    var n = initVertexBuffers(gl);
    if (n < 0) {
        console.log('failed to set the positions of the vertices');
        return;
    }

    //specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);

    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('failed to get the u_ModelMatrix');
        return;
    }

    var currentAngle = 0.0;

    var modelMatrix = new Matrix4();

    //calculate a model matrix
    var ANGLE = 60.0;
    var Tx = 0.5;
    modelMatrix.setRotate(ANGLE, 0, 0, 1);
    modelMatrix.translate(Tx, 0, 0);



    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);


    // Start to draw a triangle
    var tick = function () {
        currentAngle = animate(currentAngle);// Update the rotation angle
        draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix);
        requestAnimationFrame(tick);// Request that the browser calls tick
        
    };
    tick();

}//end of main

function initVertexBuffers(gl) {
    var vertices = new Float32Array([
        0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);

    var n = 3;

    //create Buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('failed to create the buffer object');
        return -1;
    }

    //bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    //write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('failed to get the storage location of a_Position');
        return -1;
    }
    //assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

    //enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    return n;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix) {
    // Set up rotation matrix
    modelMatrix.setRotate(currentAngle, 0, 0, 1);
    
    // Pass the rotation matrix to the vertex shader
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    // Draw a triangle
    gl.drawArrays(gl.TRIANGLES, 0, n);
    
}

// Last time when this function was called
var g_last = Date.now();
function animate(angle) {
    // Calculate the elapsed time
    var now = Date.now();
    var elapsed = now - g_last; // milliseconds
    g_last = now;
    // Update the current rotation angle (adjusted by the elapsed time)
    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle %= 360;
}