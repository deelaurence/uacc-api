module.exports = {
  paths: {
    // '/upload': {
    //   post: {
    //     tags: ['Upload'],
    //     description: 'Upload means of identification',
    //     operationId: 'uploadId',
    //     requestBody: {
    //       content: ['multipart/form-data'],
    //       schema: {
    //         $ref: '#/components/schemas/Upload',
    //       }
    //     },
    //     parameters: [
    //       {
    //         in: 'formData',
    //         name: 'myImage',
    //         type: 'file',
    //         description: 'The file to upload.',
    //       },
    //     ],
    //     responses: {
    //       0: {
    //         description: '*',
    //       },
    //     },
    //   },
    // },
    '/auth/register': {
      post: {
        tags: ['Users'],
        description: 'Create users',
        operationId: 'createUsers',
        parameters: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserRegister',
              },
            },
          },
        },
        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Users'],
        description: 'Login Users',
        operationId: 'loginUsers',
        parameters: [],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserLogin',
              },
            },
          },
        },
        responses: {
          0: {
            description: '*',
          },
        },
      },
    },

    '/auth/delete-notification/{id}': {
      delete: {
        tags: ['deleteNotification'],
        security: [{
          bearerAuth: []
        }],
        description: 'Delete notifications',
        operationId: 'updateNotifications',
        parameters: [{
          in: "path", name: 'id', type: 'string', required: true, description: "The _id of the notification"
        }],
        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/auth/read-notification/{id}': {
      patch: {
        tags: ['notificationState'],
        security: [{
          bearerAuth: []
        }],
        description: 'Update notifications',
        operationId: 'updateNotifications',
        parameters: [{ in: "path", name: 'id', type: 'string', required: true, description: "The _id of the notification" }],
        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/auth/all-notifications/': {
      get: {
        tags: ['getNotification'],
        security: [{
          bearerAuth: []
        }],
        parameters: [],
        description: 'Get All notifications',
        operationId: 'fetchNotifications',
        responses: {
          0: {
            description: '*',
          },
        },
      },
    },
    '/auth/get-notification/{id}': {
      get: {
        tags: ['getNotification'],
        security: [{
          bearerAuth: []
        }],
        parameters: [{ in: "path", name: 'id', type: 'string', required: true, description: "The _id of the notification" }],
        description: 'Get All notifications',
        operationId: 'fetchNotifications',
        responses: {
          0: {
            description: '*',
          },
        },
      },
    },


    //   '/Message/token-user': {
    //     get: {
    //       tags: ['Users'],
    //       security: [{
    //         bearerAuth: []
    //       }],
    //       description: 'Get user Object',
    //       operationId: 'getUsersObject',
    //       responses: {
    //         0: {
    //           description: '*',
    //         },
    //       },
    //     },
    //   },
    //   '/auth/edit-user': {
    //     put: {
    //       security: [{
    //         bearerAuth: []
    //       }],
    //       tags: ['Users'],
    //       description: 'Edit User Password',
    //       operationId: 'EditPassword',
    //       parameters: [],
    //       requestBody: {
    //         content: {
    //           'application/json': {
    //             schema: {
    //               $ref: '#/components/schemas/UserEdit',
    //             },
    //           },
    //         },
    //       },

    //       responses: {
    //         0: {
    //           description: '*',
    //         },
    //       },
    //     },
    //   },
    //   '/auth/edit-password': {
    //     put: {
    //       tags: ['Users'],
    //       description: 'Edit User details',
    //       operationId: 'EditUsers',
    //       parameters: [],
    //       requestBody: {
    //         content: {
    //           'application/json': {
    //             schema: {
    //               $ref: '#/components/schemas/PasswordEdit',
    //             },
    //           },
    //         },
    //       },

    //       responses: {
    //         0: {
    //           description: '*',
    //         },
    //       },
    //     },
    //   },
    //   '/Message/add': {
    //     post: {
    //       security: [{
    //         bearerAuth: []
    //       }],
    //       tags: ['Messages'],
    //       description: 'Store User Message',
    //       operationId: 'AddMessage',
    //       parameters: [],
    //       requestBody: {
    //         content: {
    //           'application/json': {
    //             schema: {
    //               $ref: '#/components/schemas/Message',
    //             },
    //           },
    //         },
    //       },

    //       responses: {
    //         0: {
    //           description: '*',
    //         },
    //       },
    //     },
    //   },
    //   '/Message/all': {
    //     get: {
    //       security: [{
    //         bearerAuth: []
    //       }],
    //       tags: ['Messages'],
    //       description: 'GET all User Message',
    //       operationId: 'getMessage',
    //       parameters: [],
    //       responses: {
    //         0: {
    //           description: '*',
    //         },
    //       },
    //     },
    //   },
    //   '/Message/single/{id}': {
    //     get: {
    //       security: [{
    //         bearerAuth: []
    //       }],
    //       tags: ['Messages'],
    //       description: 'GET single Message. NOTE: id is the Message id (_id) gotten at the instance of creating a tranasaction ',
    //       operationId: 'getSingeMessage',
    //       parameters: [{
    //         in: 'path',
    //         name: "id",
    //         type: "string",
    //         required: "true",
    //         description: "id of a Message"
    //       }],
    //       responses: {
    //         0: {
    //           description: '*',
    //         },
    //       },
    //     },
    //   },
    //   '/withdrawal/add': {
    //     post: {
    //       security: [{
    //         bearerAuth: []
    //       }],
    //       tags: ['Withdrawal'],
    //       description: 'Store User withdrawal',
    //       operationId: 'AddWithdrawal',
    //       parameters: [],
    //       requestBody: {
    //         content: {
    //           'application/json': {
    //             schema: {
    //               $ref: '#/components/schemas/Message',
    //             },
    //           },
    //         },
    //       },

    //       responses: {
    //         0: {
    //           description: '*',
    //         },
    //       },
    //     },
    //   },
    //   '/withdrawal/all': {
    //     get: {
    //       security: [{
    //         bearerAuth: []
    //       }],
    //       tags: ['Withdrawal'],
    //       description: 'GET all User withdrawal',
    //       operationId: 'getWithdrawal',
    //       parameters: [],
    //       responses: {
    //         0: {
    //           description: '*',
    //         },
    //       },
    //     },
    //   },
    //   '/Withdrawal/single/{id}': {
    //     get: {
    //       security: [{
    //         bearerAuth: []
    //       }],
    //       tags: ['Withdrawal'],
    //       description: 'GET single withdrawal. NOTE: id is the Message id (_id) gotten at the instance of creating a withdrawal',
    //       operationId: 'getSingeWithdrawal',
    //       parameters: [{
    //         in: 'path',
    //         name: "id",
    //         type: "string",
    //         required: "true",
    //         description: "id of a withdrawal"
    //       }],
    //       responses: {
    //         0: {
    //           description: '*',
    //         },
    //       },
    //     },
    //   },

  },
};
