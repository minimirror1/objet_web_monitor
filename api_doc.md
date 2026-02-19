{
  "openapi": "3.1.0",
  "info": {
    "title": "Robot Monitoring API",
    "description": "Robot Monitoring API Document",
    "version": "v1.0.0"
  },
  "servers": [
    {
      "url": "https://robot-monitor-dev.systemiic.com/"
    }
  ],
  "tags": [
    {
      "name": "Object",
      "description": "오브제 관련 API"
    },
    {
      "name": "Object Log",
      "description": "오브제 로그 관련"
    },
    {
      "name": "Object Power",
      "description": "오브제 전원 제어 API"
    },
    {
      "name": "PC API",
      "description": "PC 등록/수정/삭제 API"
    },
    {
      "name": "PC API",
      "description": "PC 제어 API"
    },
    {
      "name": "PC API",
      "description": "PC 조회 API"
    },
    {
      "name": "Store API",
      "description": "매장 등록/조회/수정/삭제 API"
    }
  ],
  "paths": {
    "/v1/cache-check": {
      "get": {
        "tags": [
          "health-check-controller"
        ],
        "operationId": "cacheCheck",
        "parameters": [
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      }
    },
    "/v1/health": {
      "get": {
        "tags": [
          "health-check-controller"
        ],
        "operationId": "healthCheck",
        "parameters": [
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "/v1/service/objects/{object_id}": {
      "get": {
        "tags": [
          "Object"
        ],
        "summary": "오브제 조회",
        "description": "오브제를 조회합니다.",
        "operationId": "getObject",
        "parameters": [
          {
            "name": "object_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ObjectStatusResponse"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "Object"
        ],
        "summary": "오브제 수정",
        "description": "오브제 정보를 수정합니다. 빈칸으로 두면 해당 필드는 업데이트하지 않습니다.",
        "operationId": "updateObject",
        "parameters": [
          {
            "name": "object_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ObjectUpdateRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ObjectUpdateResponse"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Object"
        ],
        "summary": "오브제 삭제",
        "description": "오브제를 소프트 삭제합니다.",
        "operationId": "deleteObject",
        "parameters": [
          {
            "name": "object_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ObjectDeleteResponse"
                }
              }
            }
          }
        }
      }
    },
    "/v1/service/objects/{object_id}/logs": {
      "post": {
        "tags": [
          "Object Log"
        ],
        "summary": "오브제 로그 전송",
        "description": "오브제의 로그를 전송합니다.",
        "operationId": "createObjectLog",
        "parameters": [
          {
            "name": "object_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ObjectLogRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ObjectLogResponse"
                }
              }
            }
          }
        }
      }
    },
    "/v1/service/objects/{object_id}/power": {
      "get": {
        "tags": [
          "Object Power"
        ],
        "summary": "오브제 전원 상태 SSE 이벤트 소스 생성",
        "description": "오브제의 전원 상태 변경 이벤트를 수신하기 위한 SSE 이벤트 소스를 생성",
        "operationId": "createPowerEventSource",
        "parameters": [
          {
            "name": "object_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Last-Event-ID",
            "in": "header",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "text/event-stream": {
                "schema": {
                  "$ref": "#/components/schemas/SseEmitter"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Object Power"
        ],
        "summary": "오브제 전원 상태 제어",
        "description": "오브제의 전원 상태를 변경합니다. ON 또는 OFF로 설정할 수 있습니다.",
        "operationId": "controlPower",
        "parameters": [
          {
            "name": "object_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ObjectPowerControlRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "type": "object",
                  "additionalProperties": {
                    "type": "boolean"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/v1/service/stores": {
      "get": {
        "tags": [
          "Store API"
        ],
        "summary": "매장 목록 조회",
        "description": "매장에 등록된 매장 목록을 조회합니다.",
        "operationId": "findStoreList",
        "parameters": [
          {
            "name": "country_code",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/StoreListResponse"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Store API"
        ],
        "summary": "매장 등록",
        "description": "매장 정보를 등록합니다.",
        "operationId": "createStore",
        "parameters": [
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/StoreCreateRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/StoreCreateResponse"
                }
              }
            }
          }
        }
      }
    },
    "/v1/service/stores/send-event": {
      "post": {
        "tags": [
          "Notification"
        ],
        "summary": "제어 이벤트 전송",
        "operationId": "sendEvent",
        "parameters": [
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/StoreEventSendRequestDTO"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK"
          }
        }
      }
    },
    "/v1/service/stores/{store_id}": {
      "get": {
        "tags": [
          "Store API"
        ],
        "summary": "매장 단건 조회",
        "description": "매장 ID를 통해 매장 정보를 조회합니다.",
        "operationId": "getStore",
        "parameters": [
          {
            "name": "store_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/StoreResponse"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "Store API"
        ],
        "summary": "매장 정보 수정",
        "description": "매장 ID를 통해 매장 정보를 수정합니다. 빈칸이면 수정되지 않습니다.",
        "operationId": "updateStore",
        "parameters": [
          {
            "name": "store_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/StoreUpdateRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/StoreUpdateResponse"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": [
          "Store API"
        ],
        "summary": "매장 삭제",
        "description": "매장 ID를 통해 매장을 삭제합니다.",
        "operationId": "deleteStore",
        "parameters": [
          {
            "name": "store_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/StoreDeleteResponse"
                }
              }
            }
          }
        }
      }
    },
    "/v1/service/stores/{store_id}/detail": {
      "get": {
        "tags": [
          "Store API"
        ],
        "summary": "매장 상세 정보 조회",
        "description": "매장 ID를 통해 매장의 상세 정보를 조회합니다. PC 목록과 각 PC에 속한 오브제 목록을 포함합니다.",
        "operationId": "getStoreDetail",
        "parameters": [
          {
            "name": "store_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/StoreDetailResponse"
                }
              }
            }
          }
        }
      }
    },
    "/v1/service/stores/{store_id}/pcs": {
      "get": {
        "tags": [
          "PC API"
        ],
        "summary": "매장별 PC 목록 조회",
        "description": "특정 매장에 등록된 모든 PC 목록을 조회합니다.",
        "operationId": "getPcsByStoreId",
        "parameters": [
          {
            "name": "store_id",
            "in": "query",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/PcListResponse"
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "PC API"
        ],
        "summary": "PC 등록",
        "description": "매장에 PC를 등록합니다.",
        "operationId": "createPc",
        "parameters": [
          {
            "name": "store_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PcCreateRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/PcAddResponse"
                }
              }
            }
          }
        }
      }
    },
    "/v1/service/stores/{store_id}/pcs/{pc_id}": {
      "get": {
        "tags": [
          "PC API"
        ],
        "summary": "PC 단건 조회",
        "description": "특정 PC의 정보를 조회합니다.",
        "operationId": "getPcItem",
        "parameters": [
          {
            "name": "pc_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "store_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/PcResponse"
                }
              }
            }
          }
        }
      },
      "put": {
        "tags": [
          "PC API"
        ],
        "summary": "PC 정보 수정",
        "description": "PC의 정보를 수정합니다. PC 이름과 SW 버전을 변경할 수 있습니다.",
        "operationId": "updatePcInformation",
        "parameters": [
          {
            "name": "pc_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "store_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/PcUpdateRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/PcUpdateResponse"
                }
              }
            }
          }
        }
      }
    },
    "/v1/service/stores/{store_id}/pcs/{pc_id}/health": {
      "get": {
        "tags": [
          "PC API"
        ],
        "summary": "PC 헬스 체크 SSE 이벤트 소스 생성",
        "description": "PC의 상태를 실시간으로 모니터링하기 위한 SSE 이벤트 소스를 생성합니다.",
        "operationId": "createPcHealthCheckEventSource",
        "parameters": [
          {
            "name": "pc_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "store_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Last-Event-ID",
            "in": "header",
            "required": false,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "responses": {
          "200": {
            "description": "SSE 이벤트 소스 생성 성공",
            "content": {
              "text/event-stream": {

              }
            }
          }
        }
      }
    },
    "/v1/service/stores/{store_id}/pcs/{pc_id}/objects": {
      "get": {
        "tags": [
          "Object"
        ],
        "summary": "PC에 등록된 오브제 목록 조회",
        "description": "특정 매장의 특정 PC에 등록된 모든 오브제 목록을 조회합니다.",
        "operationId": "getObjectsByPc",
        "parameters": [
          {
            "name": "store_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "pc_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "type": "array",
                  "items": {
                    "$ref": "#/components/schemas/ObjectResponse"
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "tags": [
          "Object"
        ],
        "summary": "오브제 등록",
        "description": "새로운 오브제를 등록합니다.",
        "operationId": "createObject",
        "parameters": [
          {
            "name": "store_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "pc_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/ObjectAddRequest"
              }
            }
          },
          "required": true
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/ObjectCreateResponse"
                }
              }
            }
          }
        }
      }
    },
    "/v1/service/stores/{store_id}/{pc_id}": {
      "delete": {
        "tags": [
          "PC API"
        ],
        "summary": "PC 삭제",
        "description": "PC를 삭제합니다.",
        "operationId": "deletePc",
        "parameters": [
          {
            "name": "pc_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "store_id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "Authorization",
            "in": "header",
            "description": "Bearer Authentication 토큰 (USER 권한 요청 시 필수)",
            "required": false,
            "schema": {
              "type": "string"
            },
            "example": "Bearer ..."
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "*/*": {
                "schema": {
                  "$ref": "#/components/schemas/PcDeleteResponse"
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "StoreOperateTimeDto": {
        "type": "object",
        "properties": {
          "day_of_week": {
            "type": "string",
            "description": "요일",
            "enum": [
              "MON",
              "TUE",
              "WED",
              "THU",
              "FRI",
              "SAT",
              "SUN"
            ],
            "example": "MON",
            "pattern": "^(MON|TUE|WED|THU|FRI|SAT|SUN)$"
          },
          "open_time": {
            "type": "string",
            "description": "운영 시작 시간",
            "example": "09:00"
          },
          "close_time": {
            "type": "string",
            "description": "운영 종료 시간",
            "example": "18:00"
          }
        },
        "required": [
          "close_time",
          "day_of_week",
          "open_time"
        ]
      },
      "StoreUpdateRequest": {
        "type": "object",
        "properties": {
          "store_name": {
            "type": "string",
            "description": "매장명",
            "example": "GM_하우스_도산"
          },
          "country_code": {
            "type": "string",
            "description": "국가 코드",
            "example": "KR"
          },
          "address": {
            "type": "string",
            "description": "매장주소",
            "example": "서울시 강남구 압구정로 46길 50"
          },
          "latitude": {
            "type": "number",
            "format": "double",
            "description": "위도",
            "example": 37.5253221
          },
          "longitude": {
            "type": "number",
            "format": "double",
            "description": "경도",
            "example": 127.0356785
          },
          "timezone": {
            "type": "string",
            "description": "타임존",
            "example": "Asia/Seoul"
          },
          "operate_times": {
            "type": "array",
            "description": "매장 운영 시간 (모든 요일 MON, TUE, WED, THU, FRI, SAT, SUN이 포함되어야 함)",
            "example": [
              {
                "day_of_week": "MON",
                "open_time": "09:00",
                "close_time": "18:00"
              },
              {
                "day_of_week": "TUE",
                "open_time": "09:00",
                "close_time": "18:00"
              },
              {
                "day_of_week": "WED",
                "open_time": "09:00",
                "close_time": "18:00"
              },
              {
                "day_of_week": "THU",
                "open_time": "09:00",
                "close_time": "18:00"
              },
              {
                "day_of_week": "FRI",
                "open_time": "09:00",
                "close_time": "18:00"
              },
              {
                "day_of_week": "SAT",
                "open_time": "09:00",
                "close_time": "18:00"
              },
              {
                "day_of_week": "SUN",
                "open_time": "09:00",
                "close_time": "18:00"
              }
            ],
            "items": {
              "$ref": "#/components/schemas/StoreOperateTimeDto"
            }
          }
        }
      },
      "StoreUpdateResponse": {
        "type": "object",
        "properties": {
          "store_id": {
            "type": "string",
            "description": "매장 ID"
          },
          "store_name": {
            "type": "string",
            "description": "매장 이름"
          },
          "modified_at": {
            "type": "string",
            "format": "date-time",
            "description": "수정 시간"
          }
        },
        "required": [
          "modified_at",
          "store_id",
          "store_name"
        ]
      },
      "PcUpdateRequest": {
        "type": "object",
        "properties": {
          "pc_name": {
            "type": "string",
            "description": "변경하고자 하는 PC Name을 입력하세요. 빈칸으로 두면 PC Name은 업데이트하지 않습니다.",
            "example": "PC001"
          },
          "sw_version": {
            "type": "string",
            "description": "변경하고자 하는 SW Version을 입력하세요. 빈칸으로 두면 SW Version은 업데이트하지 않습니다.",
            "example": "10.0v"
          }
        }
      },
      "PcUpdateResponse": {
        "type": "object",
        "properties": {
          "store_id": {
            "type": "string"
          },
          "pc_id": {
            "type": "string"
          },
          "modified_at": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": [
          "modified_at",
          "pc_id",
          "store_id"
        ]
      },
      "FirmwareVersionUpdateDto": {
        "type": "object",
        "properties": {
          "board_id": {
            "type": "string",
            "description": "보드 ID",
            "example": "1-1"
          },
          "board_type": {
            "type": "string",
            "description": "보드 타입",
            "example": "MAI"
          },
          "version": {
            "type": "string",
            "description": "버전",
            "example": "0.1.51"
          }
        }
      },
      "ObjectOperationTimeUpdateDto": {
        "type": "object",
        "properties": {
          "start_time": {
            "type": "string",
            "description": "시작 시간",
            "example": "09:00"
          },
          "end_time": {
            "type": "string",
            "description": "종료 시간",
            "example": "22:00"
          }
        }
      },
      "ObjectUpdateRequest": {
        "type": "object",
        "properties": {
          "object_name": {
            "type": "string",
            "description": "변경하고자 하는 오브제 이름. 빈칸으로 두면 오브제 이름은 업데이트하지 않습니다.",
            "example": "Robot1"
          },
          "object_operation_time": {
            "$ref": "#/components/schemas/ObjectOperationTimeUpdateDto",
            "description": "변경하고자 하는 오브제 동작 시간. 빈칸으로 두면 동작 시간은 업데이트하지 않습니다."
          },
          "schedule_flag": {
            "type": "boolean",
            "description": "변경하고자 하는 스케줄 플래그. 빈칸으로 두면 스케줄 플래그는 업데이트하지 않습니다.",
            "enum": [
              "true",
              "false"
            ],
            "example": true
          },
          "firmware_version": {
            "$ref": "#/components/schemas/FirmwareVersionUpdateDto",
            "description": "변경하고자 하는 펌웨어 버전. 빈칸으로 두면 펌웨어 버전은 업데이트하지 않습니다."
          },
          "operation_status": {
            "type": "string",
            "description": "변경하고자 하는 동작 상태. 빈칸으로 두면 동작 상태는 업데이트하지 않습니다.",
            "enum": [
              "PLAY",
              "STOP",
              "REPEAT"
            ],
            "example": "PLAY"
          }
        }
      },
      "ObjectUpdateResponse": {
        "type": "object",
        "properties": {
          "object_id": {
            "type": "string",
            "description": "오브제 ID",
            "example": "0KPX4RM5GZWT0"
          },
          "modified_at": {
            "type": "string",
            "format": "date-time",
            "description": "수정 시간",
            "example": "2025-05-15T00:00:00Z"
          }
        },
        "required": [
          "modified_at",
          "object_id"
        ]
      },
      "StoreCreateRequest": {
        "type": "object",
        "properties": {
          "store_name": {
            "type": "string",
            "description": "매장명",
            "example": "GM_하우스_도산"
          },
          "country_code": {
            "type": "string",
            "description": "국가 코드",
            "example": "KR"
          },
          "address": {
            "type": "string",
            "description": "매장주소",
            "example": "서울시 강남구 압구정로 46길 50"
          },
          "latitude": {
            "type": "number",
            "format": "double",
            "description": "위도",
            "example": 37.5253221
          },
          "longitude": {
            "type": "number",
            "format": "double",
            "description": "경도",
            "example": 127.0356785
          },
          "timezone": {
            "type": "string",
            "description": "타임존",
            "example": "Asia/Seoul"
          },
          "operate_times": {
            "type": "array",
            "description": "매장 운영 시간",
            "example": [
              {
                "day_of_week": "MON",
                "open_time": "09:00",
                "close_time": "18:00"
              },
              {
                "day_of_week": "TUE",
                "open_time": "09:00",
                "close_time": "18:00"
              },
              {
                "day_of_week": "WED",
                "open_time": "09:00",
                "close_time": "18:00"
              },
              {
                "day_of_week": "THU",
                "open_time": "09:00",
                "close_time": "18:00"
              },
              {
                "day_of_week": "FRI",
                "open_time": "09:00",
                "close_time": "19:00"
              },
              {
                "day_of_week": "SAT",
                "open_time": "09:00",
                "close_time": "19:00"
              },
              {
                "day_of_week": "SUN",
                "open_time": "09:00",
                "close_time": "19:00"
              }
            ],
            "items": {
              "$ref": "#/components/schemas/StoreOperateTimeDto"
            }
          }
        },
        "required": [
          "address",
          "country_code",
          "latitude",
          "longitude",
          "operate_times",
          "store_name",
          "timezone"
        ]
      },
      "StoreCreateResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "매장 ID"
          },
          "store_name": {
            "type": "string",
            "description": "매장 이름"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "description": "생성 시간"
          }
        },
        "required": [
          "created_at",
          "id",
          "store_name"
        ]
      },
      "PcCreateRequest": {
        "type": "object",
        "properties": {
          "pc_name": {
            "type": "string",
            "description": "PC Name",
            "example": "PC001"
          },
          "sw_version": {
            "type": "string",
            "description": "SW Version",
            "example": 10
          }
        },
        "required": [
          "pc_name",
          "sw_version"
        ]
      },
      "PcAddResponse": {
        "type": "object",
        "properties": {
          "store_id": {
            "type": "string"
          },
          "pc_id": {
            "type": "string"
          },
          "created_at": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": [
          "created_at",
          "pc_id",
          "store_id"
        ]
      },
      "FirmwareVersionDto": {
        "type": "object",
        "properties": {
          "board_id": {
            "type": "string",
            "description": "Board Id",
            "example": "1-1"
          },
          "board_type": {
            "type": "string",
            "description": "Board Type",
            "example": "MAI"
          },
          "version": {
            "type": "string",
            "description": "Version",
            "example": "0.1.51"
          }
        },
        "required": [
          "board_id",
          "board_type",
          "version"
        ]
      },
      "ObjectAddRequest": {
        "type": "object",
        "properties": {
          "object_name": {
            "type": "string",
            "description": "Object Name",
            "example": "Robot1"
          },
          "object_operation_time": {
            "$ref": "#/components/schemas/ObjectOperationTimeDto",
            "description": "Object Operation Time"
          },
          "schedule_flag": {
            "type": "boolean",
            "description": "Schedule Flag",
            "enum": [
              "true",
              "false"
            ],
            "example": true
          },
          "firmware_version": {
            "$ref": "#/components/schemas/FirmwareVersionDto",
            "description": "Firmware Version"
          },
          "operation_status": {
            "type": "string",
            "description": "Operation Status",
            "enum": [
              "PLAY",
              "STOP",
              "REPEAT"
            ],
            "example": "PLAY"
          }
        },
        "required": [
          "firmware_version",
          "object_name",
          "object_operation_time",
          "operation_status",
          "schedule_flag"
        ]
      },
      "ObjectOperationTimeDto": {
        "type": "object",
        "properties": {
          "start_time": {
            "type": "string",
            "description": "Start Time",
            "example": "09:00"
          },
          "end_time": {
            "type": "string",
            "description": "End Time",
            "example": "22:00"
          }
        },
        "required": [
          "end_time",
          "start_time"
        ]
      },
      "ObjectCreateResponse": {
        "type": "object",
        "properties": {
          "object_id": {
            "type": "string"
          },
          "created_at": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": [
          "created_at",
          "object_id"
        ]
      },
      "StoreEventSendRequestDTO": {
        "type": "object",
        "properties": {
          "storeId": {
            "type": "string"
          },
          "pcId": {
            "type": "string"
          },
          "objectId": {
            "type": "string"
          },
          "event": {
            "type": "string",
            "enum": [
              "ON",
              "OFF",
              "REBOOT"
            ]
          }
        }
      },
      "ObjectPowerControlRequest": {
        "type": "object",
        "description": "오브제 전원 제어 요청",
        "properties": {
          "power_status": {
            "type": "string",
            "description": "전원 상태",
            "enum": [
              "ON",
              "OFF"
            ],
            "example": "ON",
            "pattern": "^(ON|OFF)$"
          }
        },
        "required": [
          "power_status"
        ]
      },
      "ErrorDataDto": {
        "type": "object",
        "properties": {
          "boardId": {
            "type": "string",
            "description": "Board ID",
            "example": "1-1"
          },
          "boardType": {
            "type": "string",
            "description": "Board Type",
            "example": "MAI"
          },
          "errorCode": {
            "type": "string",
            "description": "Error Code",
            "example": 16
          }
        }
      },
      "ObjectLogRequest": {
        "type": "object",
        "properties": {
          "power_status": {
            "type": "string",
            "description": "Power Status",
            "enum": [
              "ON",
              "OFF"
            ],
            "example": "ON",
            "pattern": "ON|OFF"
          },
          "operation_status": {
            "type": "string",
            "description": "Operation Status",
            "enum": [
              "PLAY",
              "STOP",
              "REPEAT"
            ],
            "example": "PLAY"
          },
          "power_consumption": {
            "$ref": "#/components/schemas/PowerConsumptionDto",
            "description": "Power Consumption"
          },
          "error_data": {
            "type": "array",
            "description": "Error Data",
            "items": {
              "$ref": "#/components/schemas/ErrorDataDto"
            }
          }
        },
        "required": [
          "operation_status",
          "power_status"
        ]
      },
      "PowerConsumptionDto": {
        "type": "object",
        "properties": {
          "volt": {
            "type": "string",
            "description": "Volt",
            "example": "220V"
          },
          "ampere": {
            "type": "string",
            "description": "Ampere",
            "example": "10A"
          },
          "watt": {
            "type": "string",
            "description": "Watt",
            "example": "2200W"
          }
        }
      },
      "ObjectLogResponse": {
        "type": "object",
        "properties": {
          "object_id": {
            "type": "string",
            "description": "Object ID",
            "example": "0KQA3CVKAEFST"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "description": "Created At",
            "example": "2023-04-29T06:20:05.916692Z"
          }
        },
        "required": [
          "created_at",
          "object_id"
        ]
      },
      "StoreListResponse": {
        "type": "object",
        "properties": {
          "stores": {
            "type": "array",
            "description": "Store List",
            "items": {
              "$ref": "#/components/schemas/StoreResponse"
            }
          }
        },
        "required": [
          "stores"
        ]
      },
      "StoreResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Store ID",
            "example": "0KPW9SYR11DF6"
          },
          "store_name": {
            "type": "string",
            "description": "Store Name",
            "example": "Store 1"
          },
          "country_code": {
            "type": "string",
            "description": "Country Code",
            "example": "KR"
          },
          "address": {
            "type": "string",
            "description": "Address",
            "example": 123
          },
          "latitude": {
            "type": "number",
            "format": "double",
            "description": "Latitude",
            "example": 37.5665
          },
          "longitude": {
            "type": "number",
            "format": "double",
            "description": "Longitude",
            "example": 126.978
          },
          "timezone": {
            "type": "string",
            "description": "Timezone",
            "example": "Asia/Seoul"
          },
          "operate_times": {
            "type": "array",
            "description": "Store Operation Times",
            "items": {
              "$ref": "#/components/schemas/StoreOperateTimeDto"
            }
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "description": "Created At",
            "example": "2023-01-01T00:00:00Z"
          },
          "modified_at": {
            "type": "string",
            "format": "date-time",
            "description": "Modified At",
            "example": "2023-01-01T00:00:00Z"
          }
        },
        "required": [
          "country_code",
          "created_at",
          "id",
          "modified_at",
          "store_name"
        ]
      },
      "PcListResponse": {
        "type": "object",
        "properties": {
          "pcs": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/PcResponse"
            }
          }
        },
        "required": [
          "pcs"
        ]
      },
      "PcResponse": {
        "type": "object",
        "properties": {
          "store_id": {
            "type": "string"
          },
          "pc_id": {
            "type": "string"
          },
          "pc_name": {
            "type": "string"
          },
          "sw_version": {
            "type": "string"
          },
          "created_at": {
            "type": "string",
            "format": "date-time"
          },
          "modified_at": {
            "type": "string",
            "format": "date-time"
          },
          "created_by": {
            "type": "string"
          },
          "modified_by": {
            "type": "string"
          }
        },
        "required": [
          "created_at",
          "pc_id",
          "pc_name",
          "store_id",
          "sw_version"
        ]
      },
      "ErrorData": {
        "type": "object",
        "properties": {
          "boardId": {
            "type": "string",
            "description": "Board ID",
            "example": "1-1"
          },
          "boardType": {
            "type": "string",
            "description": "Board Type",
            "example": "MAI"
          },
          "errorCode": {
            "type": "string",
            "description": "Error Code",
            "example": 16
          }
        },
        "required": [
          "boardId",
          "boardType",
          "errorCode"
        ]
      },
      "ObjectResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "object_name": {
            "type": "string"
          },
          "operation_status": {
            "type": "string",
            "enum": [
              "PLAY",
              "STOP",
              "REPEAT"
            ]
          },
          "schedule_flag": {
            "type": "boolean"
          },
          "power_status": {
            "type": "string",
            "enum": [
              "ON",
              "OFF"
            ]
          },
          "power_consumption": {
            "$ref": "#/components/schemas/PowerConsumption"
          },
          "error_data": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ErrorData"
            }
          },
          "modified_at": {
            "type": "string",
            "format": "date-time"
          },
          "timezone": {
            "type": "string"
          }
        },
        "required": [
          "id",
          "object_name",
          "operation_status",
          "schedule_flag"
        ]
      },
      "PowerConsumption": {
        "type": "object",
        "properties": {
          "volt": {
            "type": "string",
            "description": "Volt",
            "example": "220V"
          },
          "ampere": {
            "type": "string",
            "description": "Ampere",
            "example": "10A"
          },
          "watt": {
            "type": "string",
            "description": "Watt",
            "example": "2200W"
          }
        },
        "required": [
          "ampere",
          "volt",
          "watt"
        ]
      },
      "PcWithObjects": {
        "type": "object",
        "properties": {
          "pc_id": {
            "type": "string"
          },
          "pc_name": {
            "type": "string"
          },
          "sw_version": {
            "type": "string"
          },
          "objects": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/ObjectResponse"
            }
          },
          "created_at": {
            "type": "string",
            "format": "date-time"
          },
          "modified_at": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": [
          "created_at",
          "objects",
          "pc_id",
          "pc_name",
          "sw_version"
        ]
      },
      "StoreDetailResponse": {
        "type": "object",
        "properties": {
          "store_id": {
            "type": "string"
          },
          "store_name": {
            "type": "string"
          },
          "country_code": {
            "type": "string"
          },
          "address": {
            "type": "string"
          },
          "latitude": {
            "type": "number",
            "format": "double"
          },
          "longitude": {
            "type": "number",
            "format": "double"
          },
          "timezone": {
            "type": "string"
          },
          "operate_times": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/StoreOperateTimeDto"
            }
          },
          "pcs": {
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/PcWithObjects"
            }
          },
          "created_at": {
            "type": "string",
            "format": "date-time"
          },
          "modified_at": {
            "type": "string",
            "format": "date-time"
          }
        },
        "required": [
          "country_code",
          "created_at",
          "operate_times",
          "pcs",
          "store_id",
          "store_name",
          "timezone"
        ]
      },
      "ObjectStatusResponse": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Object ID",
            "example": "0KPX4RM5GZWT0"
          },
          "object_name": {
            "type": "string",
            "description": "Object Name",
            "example": "Robot 1"
          },
          "status_details": {
            "$ref": "#/components/schemas/StatusDetails",
            "description": "Status Details"
          },
          "created_at": {
            "type": "string",
            "format": "date-time",
            "description": "생성일",
            "example": "2025-05-15T06:37:17.367995Z"
          },
          "modified_at": {
            "type": "string",
            "format": "date-time",
            "description": "수정일",
            "example": "2025-05-15T06:37:17.367995Z"
          },
          "timezone": {
            "type": "string",
            "description": "Store Timezone",
            "example": "Asia/Seoul"
          }
        },
        "required": [
          "created_at",
          "id",
          "modified_at",
          "object_name",
          "status_details"
        ]
      },
      "StatusDetails": {
        "type": "object",
        "properties": {
          "power_status": {
            "type": "string",
            "description": "Power Status",
            "enum": [
              "ON",
              "OFF"
            ],
            "example": "ON"
          },
          "operation_status": {
            "type": "string",
            "description": "Operation Status",
            "enum": [
              "PLAY",
              "STOP",
              "REPEAT"
            ],
            "example": "PLAY"
          },
          "power_consumption": {
            "$ref": "#/components/schemas/PowerConsumption",
            "description": "Power Consumption"
          },
          "error_data": {
            "type": "array",
            "description": "Error Data",
            "items": {
              "$ref": "#/components/schemas/ErrorData"
            }
          },
          "modified_at": {
            "type": "string",
            "format": "date-time",
            "description": "Snapshot Modified Date"
          }
        },
        "required": [
          "operation_status",
          "power_status"
        ]
      },
      "SseEmitter": {
        "type": "object",
        "properties": {
          "timeout": {
            "type": "integer",
            "format": "int64"
          }
        }
      },
      "StoreDeleteResponse": {
        "type": "object",
        "properties": {
          "store_id": {
            "type": "string",
            "description": "매장 ID"
          },
          "store_name": {
            "type": "string",
            "description": "매장 이름"
          },
          "deleted_at": {
            "type": "string",
            "format": "date-time",
            "description": "삭제 시간"
          }
        },
        "required": [
          "deleted_at",
          "store_id",
          "store_name"
        ]
      },
      "PcDeleteResponse": {
        "type": "object",
        "properties": {
          "store_id": {
            "type": "string",
            "description": "매장 ID"
          },
          "pc_id": {
            "type": "string",
            "description": "PC ID"
          },
          "pc_name": {
            "type": "string",
            "description": "PC 이름"
          },
          "deleted_at": {
            "type": "string",
            "format": "date-time",
            "description": "삭제 시간"
          }
        },
        "required": [
          "deleted_at",
          "pc_id",
          "pc_name",
          "store_id"
        ]
      },
      "ObjectDeleteResponse": {
        "type": "object",
        "properties": {
          "object_id": {
            "type": "string",
            "description": "오브제 ID"
          },
          "object_name": {
            "type": "string",
            "description": "오브제 이름"
          },
          "deleted_at": {
            "type": "string",
            "format": "date-time",
            "description": "삭제 시간"
          }
        },
        "required": [
          "deleted_at",
          "object_id",
          "object_name"
        ]
      }
    },
    "securitySchemes": {
      "Authorization": {
        "type": "http",
        "name": "Authorization",
        "in": "header",
        "scheme": "bearer",
        "bearerFormat": "JWT"
      }
    }
  }
}