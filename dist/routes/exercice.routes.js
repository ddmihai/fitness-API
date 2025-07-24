"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rateLimiter_1 = require("../middlewares/security/rateLimiter");
const createExercice_middleware_1 = require("../middlewares/validators/createExercice.middleware");
const validator_middleware_1 = require("../middlewares/validators/validator.middleware");
const createExercice_controller_1 = require("../controllers/exercices/createExercice/createExercice.controller");
const allowCreationOdExercices_1 = require("../middlewares/auth/allowCreationOdExercices");
const permissions_constants_1 = require("../helpers/constants/permissions.constants");
const uploads_middleware_1 = require("../middlewares/uploads/uploads.middleware");
const uploadImagesExercice_controller_1 = require("../controllers/exercices/uploadImagesExercice/uploadImagesExercice.controller");
const deleteImages_controller_1 = require("../controllers/exercices/deleteImages/deleteImages.controller");
const deleteExercice_controller_1 = require("../controllers/exercices/deleteExercice/deleteExercice.controller");
const getAllExercices_1 = require("../controllers/exercices/get-all/getAllExercices");
const exerciceRouter = (0, express_1.Router)();
/**
 * @swagger
 * /api/v1/exercices/create-exercice:
 *   post:
 *     summary: Create a new exercice
 *     tags:
 *       - Exercices
 *     security:
 *       - cookieAuth: []      # Assuming JWT sent via cookie
 *     description: Creates a new exercice. Requires permission `create_exercices`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - bodyPart
 *               - equipment
 *               - targetMuscle
 *               - tags
 *               - focus
 *               - isBodyweight
 *             properties:
 *               name:
 *                 type: string
 *                 example: push-up
 *               imageUrl:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://example.com/image.jpg"
 *                     publicId:
 *                       type: string
 *                       example: "fitness-images/push-up-123abc"
 *               bodyPart:
 *                 type: string
 *                 example: chest
 *               equipment:
 *                 type: string
 *                 example: none
 *               targetMuscle:
 *                 type: string
 *                 example: pectoralis major
 *               secondaryMuscles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["triceps", "deltoids"]
 *               instructions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Start in plank position", "Lower body", "Push up"]
 *               videoUrl:
 *                 type: string
 *                 example: "https://example.com/push-up-video.mp4"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["compound", "bodyweight"]
 *               focus:
 *                 type: string
 *                 enum: [strength, hypertrophy, mobility, rehab, cardio]
 *                 example: strength
 *               isBodyweight:
 *                 type: boolean
 *                 example: true
 *               description:
 *                 type: string
 *                 example: "A classic bodyweight exercise to strengthen chest and arms."
 *               difficulty:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *                 example: beginner
 *               category:
 *                 type: string
 *                 enum: [gym, home]
 *                 example: home
 *               verified:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Exercice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Exercice added successfully
 *                 exercice:
 *                   $ref: '#/components/schemas/Exercice'
 *       400:
 *         description: Validation Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized (No or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden (No required permission)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Conflict (Duplicate exercice name)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Exercice already exists
 *                 exerciceFallback:
 *                   type: object
 *                   description: The submitted exercice data
 *       429:
 *         description: Too Many Requests - Rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * components:
 *   schemas:
 *     Exercice:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60f7b2c5f38b0c1f243f679a
 *         name:
 *           type: string
 *         imageUrl:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               publicId:
 *                 type: string
 *         bodyPart:
 *           type: string
 *         equipment:
 *           type: string
 *         targetMuscle:
 *           type: string
 *         secondaryMuscles:
 *           type: array
 *           items:
 *             type: string
 *         instructions:
 *           type: array
 *           items:
 *             type: string
 *         videoUrl:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         focus:
 *           type: string
 *           enum: [strength, hypertrophy, mobility, rehab, cardio]
 *         isBodyweight:
 *           type: boolean
 *         description:
 *           type: string
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *         category:
 *           type: string
 *           enum: [gym, home]
 *         verified:
 *           type: boolean
 *         addedBy:
 *           type: string
 *         addedAt:
 *           type: string
 *           format: date-time
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: error
 *         statusCode:
 *           type: integer
 *           example: 400
 *         message:
 *           type: string
 *           example: Validation Error
 *         details:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *               message:
 *                 type: string
 */
exerciceRouter.post('/create-exercice', rateLimiter_1.exerciceLimiter, (0, allowCreationOdExercices_1.requirePermission)(permissions_constants_1.PERMISSIONS.admin.CREATE_EXERCICES), createExercice_middleware_1.exerciseValidationSchema, validator_middleware_1.validateRequest, createExercice_controller_1.createExercice);
/**
 * @swagger
 * /api/v1/exercices/upload:
 *   post:
 *     summary: Upload an image for an exercice
 *     tags:
 *       - Exercices
 *     security:
 *       - cookieAuth: []  # Assuming JWT token in cookie for auth
 *     description: |
 *       Upload an image for an exercice.

 *       **Note:** This endpoint is rate limited to 50 requests per 15 minutes per IP.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - exerciceId
 *               - image
 *             properties:
 *               exerciceId:
 *                 type: string
 *                 description: MongoDB ObjectId of the exercice to upload image for
 *                 example: 60f7b2c5f38b0c1f243f679a
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (max 10MB, image only)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Upload successful!
 *                 imageUrl:
 *                   type: string
 *                   example: https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/folder/your-image.webp
 *       400:
 *         description: Bad request - validation errors or missing data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - missing or invalid authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - user lacks permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exercice not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests - rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 429
 *                 error:
 *                   type: string
 *                   example: Too many requests from this IP, please try again later.
 *       500:
 *         description: Server error while uploading image
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exerciceRouter.post('/upload', rateLimiter_1.exerciceLimiter, uploads_middleware_1.upload.single('image'), (0, allowCreationOdExercices_1.requirePermission)(permissions_constants_1.PERMISSIONS.admin.CREATE_EXERCICES), uploadImagesExercice_controller_1.uploadExerciceImages);
/**
 * @swagger
 * /api/v1/exercices/delete-image/{exerciceId}/{imageId}:
 *   delete:
 *     summary: Delete an image from an exercice
 *     tags:
 *       - Exercices
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciceId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the exercice
 *         example: 60f7b2c5f38b0c1f243f679a
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the image subdocument inside exercice
 *         example: 68797d01f380acedc427e275
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Image deleted successfully
 *       400:
 *         description: Invalid parameters or IDs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - missing required permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exercice or image not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests (Rate limit exceeded)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 429
 *                 error:
 *                   type: string
 *                   example: Too many requests from this IP, please try again later.
 *       500:
 *         description: Internal server error while deleting image
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exerciceRouter.delete('/delete-image/:exerciceId/:imageId', rateLimiter_1.exerciceLimiter, (0, allowCreationOdExercices_1.requirePermission)(permissions_constants_1.PERMISSIONS.admin.CREATE_EXERCICES), deleteImages_controller_1.deleteImagesFromExercice);
/**
 * @swagger
 * /api/v1/exercices/delete-exercice/{exerciceId}:
 *   delete:
 *     summary: Delete an exercice and all associated images
 *     tags:
 *       - Exercices
 *     security:
 *       - cookieAuth: []  # Adjust based on your auth scheme
 *     parameters:
 *       - in: path
 *         name: exerciceId
 *         required: true
 *         schema:
 *           type: string
 *           example: 60f7b2c5f38b0c1f243f679a
 *         description: MongoDB ObjectId of the exercice to delete
 *     responses:
 *       200:
 *         description: Exercice deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Exercice deleted successfully
 *             example:
 *               status: 200
 *               message: Exercice deleted successfully
 *       400:
 *         description: Invalid exerciceId parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized - missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - user lacks permission
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exercice not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests - rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 429
 *                 error:
 *                   type: string
 *                   example: Too many requests from this IP, please try again later.
 *             example:
 *               status: 429
 *               error: Too many requests from this IP, please try again later.
 *       500:
 *         description: Internal Server Error while deleting exercice
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exerciceRouter.delete('/delete-exercice/:exerciceId', rateLimiter_1.exerciceLimiter, (0, allowCreationOdExercices_1.requirePermission)(permissions_constants_1.PERMISSIONS.admin.DELETE_EXERCICE), deleteExercice_controller_1.deleteExercice);
/**
 * @swagger
 * /api/v1/exercices/get-all:
 *   get:
 *     summary: Get all exercices with pagination (cached)
 *     tags:
 *       - Exercices
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: "Page number (default: 1)"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: "Number of exercices per page (default: 10)"
 *     responses:
 *       200:
 *         description: Paginated list of exercices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Exercice'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     pageSize:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 5
 *                     totalCount:
 *                       type: integer
 *                       example: 45
 *                 fromCache:
 *                   type: boolean
 *                   description: Indicates if the response was served from cache
 *                   example: true
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests - rate limit exceeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 429
 *                 error:
 *                   type: string
 *                   example: Too many requests from this IP, please try again later.
 *       500:
 *         description: Server error while querying exercices
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
exerciceRouter.get('/get-all', rateLimiter_1.exerciceLimiter, getAllExercices_1.getAllExercices);
exports.default = exerciceRouter;
