export const stateMachineExampleDummyData = {
    "InvoiceDispatch":  {
      "_id": "public:0xd17fbf90fdb69e13fe2563abc4b6d722e913e6372f72850f4d524edefe6ddd74_Invoice",
      "AppType": "CommerceSM",
      "Base_sm": "@statemachine/extendedCommerceSM:public:0x161f0430cae79713cda4e848416f2f561704048d5ac40d6ed0f5829fda2ac1a7",
      "Branch": false,
      "Category": "Apps",
      "Desc": "The Core Protocol Commerce StateMachine for Invoice OMV Nykaa",
      "ExchangeParamID": [
        {
          "paramID": "0x5e282dE188b68864e3B140287640c075C46F4fF4",
          "publicKey": "133e15a25b2657b7d3177ca1281a261099db2fdc9993209b853690fc7ce805fbb75fe5fd9bd839509de8a67fde8afc1cf24f3743272f06cf4f1ac87b2a64bf90"
        }
      ],
      "Index": 5,
      "Name": "Invoice and Dispatch OMV",
      "Organizations": [
        {
          "Desc": "Buyer",
          "Teams": [
            {
              "Desc": "SCM Internal",
              "Role": "Buyer"
            },
            {
              "Role": "Supplychain",
              "Desc": "Supplychain Head"
            },
            {
              "Desc": "Warehouse",
              "Role": "Warehouse"
            },
            {
              "Desc": "Finance",
              "Role": "Finance"
            }
          ],
          "Name": "Buyer"
        },
        {
          "Teams": [
            {
              "Role": "Seller",
              "Desc": "Manufacturer Planner"
            },
            {
              "Role": "Purchase",
              "Desc": "Manufacturer Purchase"
            },
            {
              "Role": "Dispatch",
              "Desc": "Manufacturer Dispatch"
            },
            {
              "Role": "Accounts",
              "Desc": "Manufacturer Accounts"
            }
          ],
          "Name": "Seller",
          "Desc": "Seller"
        }
      ],
      "Props": {
        "Icon": 107,
        "BgColor": "#E5F1FF"
      },
      "Roles": [
        "Buyer",
        "Seller",
        "Supplychain",
        "Warehouse",
        "Finance",
        "Purchase",
        "Dispatch",
        "Accounts"
      ],
      "StartAt": "Invoice",
      "Start_sm": "@statemachine/CommerceSM:public:0x56ab67f5e470998c82a64b9477a789d24f1c9f37406f01f4163b06f58acc11f0",
      "States": {
        "PurchaseReq": {
          "Desc": "Purchase Requisition",
          "NextState": "Contract",
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "Props": null
        },
        "DigitalReceipt": {
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Props": null,
          "End": true,
          "Desc": "Digital Receipt",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Seller"
          ]
        },
        "Contract": {
          "Owner": [
            "Buyer",
            "Seller"
          ],
          "Props": null,
          "Desc": "Contract",
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "NextState": "Orders",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9"
        },
        "AcceptNote": {
          "Props": null,
          "End": true,
          "Desc": "Accept Note",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Seller"
          ],
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          }
        },
        "Orders": {
          "Props": null,
          "Desc": "Orders",
          "NextState": "Invoice",
          "AttachStates": [
            "AcceptNote"
          ],
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          }
        },
        "History": {
          "Visibility": {
            "Seller": true,
            "Buyer": true,
            "Supplychain": true,
            "Warehouse": true,
            "Finance": true
          },
          "Owner": [],
          "Props": null,
          "End": true,
          "Desc": "History",
          "Schema": "",
          "SubStates": {}
        },
        "Invoice": {
          "Props": {
            "Edit": true,
            "Flip": true
          },
          "Desc": "Invoice and Dispatch",
          "SubStates": {},
          "Visibility": {
            "Finance": true,
            "Seller": true,
            "Buyer": true,
            "Supplychain": true,
            "Warehouse": true,
            "Purchase": true,
            "Dispatch": true,
            "Accounts": true
          },
          "NextState": "GRN",
          "AttachStates": [
            "History"
          ],
          "Schema": "@schema/Commerce:public:0xa004bca4e4ccc2df09505d7b2bf36a0818d085ea2f942d6fc19b3d9d0777480b",
          "Owner": [
            "Seller",
            "Buyer",
            "Dispatch",
            "Accounts"
          ]
        },
        "GRN": {
          "Owner": [
            "Buyer",
            "Warehouse"
          ],
          "Props": null,
          "Desc": "GRN",
          "SubStates": {},
          "Visibility": {
            "Dispatch": true,
            "Accounts": true,
            "Seller": true,
            "Buyer": true,
            "Supplychain": true,
            "Warehouse": true,
            "Finance": true,
            "Purchase": true
          },
          "NextState": "Payment",
          "Schema": "@schema/Commerce:public:0x78d53d8551afe047391f32e439a8ce4de69e978dc96e8bab1d38ce450ce32e8c"
        },
        "Payment": {
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Owner": [
            "Buyer"
          ],
          "Props": null,
          "Desc": "Payment",
          "NextState": "DigitalReceipt",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "SubStates": {}
        }
      },
      "installed": 1,
      "orgParamID": "0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
      "smID": "public:0xd17fbf90fdb69e13fe2563abc4b6d722e913e6372f72850f4d524edefe6ddd74"
    },
    "CostingSheet":{
      "_id": "public:0xe42ee5a9d5b19343925ed266043fbcfe1bce482f3eb5248f613a7a88c51e0841_Invoice",
      "AppType": "CommerceSM",
      "Base_sm": "@statemachine/extendedCommerceSM:public:0x161f0430cae79713cda4e848416f2f561704048d5ac40d6ed0f5829fda2ac1a7",
      "Branch": false,
      "Category": "Apps",
      "Desc": "The Core Protocol Commerce StateMachine for Costing Sheet OMV Nykaa",
      "ExchangeParamID": [
        {
          "paramID": "0x5e282dE188b68864e3B140287640c075C46F4fF4",
          "publicKey": "133e15a25b2657b7d3177ca1281a261099db2fdc9993209b853690fc7ce805fbb75fe5fd9bd839509de8a67fde8afc1cf24f3743272f06cf4f1ac87b2a64bf90"
        }
      ],
      "Index": 3,
      "Name": "Costing Sheet OMV",
      "Organizations": [
        {
          "Name": "Buyer",
          "Desc": "Buyer",
          "Teams": [
            {
              "Role": "Buyer",
              "Desc": "SCM Internal"
            },
            {
              "Desc": "Supplychain Head",
              "Role": "Supplychain"
            },
            {
              "Desc": "Warehouse",
              "Role": "Warehouse"
            },
            {
              "Desc": "Finance",
              "Role": "Finance"
            }
          ]
        },
        {
          "Teams": [
            {
              "Desc": "Manufacturer Planner",
              "Role": "Seller"
            },
            {
              "Desc": "Manufacturer Purchase",
              "Role": "Purchase"
            },
            {
              "Role": "Dispatch",
              "Desc": "Manufacturer Dispatch"
            },
            {
              "Desc": "Manufacturer Accounts",
              "Role": "Accounts"
            }
          ],
          "Name": "Seller",
          "Desc": "Seller"
        }
      ],
      "Props": {
        "Icon": 107,
        "BgColor": "#E5F1FF"
      },
      "Roles": [
        "Buyer",
        "Seller",
        "Finance",
        "Supplychain",
        "Warehouse",
        "Purchase",
        "Dispatch",
        "Accounts"
      ],
      "StartAt": "CostingSheet",
      "Start_sm": "@statemachine/extendedCommerceSM:public:0x56ab67f5e470998c82a64b9477a789d24f1c9f37406f01f4163b06f58acc11f0",
      "States": {
        "DigitalReceipt": {
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Props": null,
          "End": true,
          "Desc": "Digital Receipt",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Seller"
          ],
          "SubStates": {}
        },
        "AcceptNote": {
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Props": null,
          "End": true,
          "Desc": "Accept Note",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Seller"
          ],
          "SubStates": {}
        },
        "History": {
          "End": true,
          "Desc": "History",
          "Schema": "",
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Finance": true,
            "Supplychain": true,
            "Buyer": true
          },
          "Owner": [],
          "Props": null
        },
        "Contract": {
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "NextState": "Orders",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer",
            "Seller"
          ],
          "Props": null,
          "Desc": "Contract"
        },
        "CostingSheet": {
          "AttachStates": [
            "History"
          ],
          "Owner": [
            "Seller",
            "Buyer",
            "Finance",
            "Accounts"
          ],
          "NextState": "Invoice",
          "Desc": "Costing Sheet",
          "Schema": "@schema/Commerce:public:0x07c995cfe29592d5f355729489296c46662c42a9a7de94122ff60255b475930e",
          "Props": {
            "diff": {
              "to": "OrderedItems.I_Quantity",
              "from": "OrderedItems.I_Quantity"
            },
            "Edit": true,
            "Flip": true
          },
          "SubStates": {
            "Approved": {
              "Visibility": {
                "Seller": true,
                "Supplychain": true,
                "Purchase": true,
                "Dispatch": true,
                "Accounts": true,
                "Finance": true,
                "Buyer": true
              },
              "Rule": null,
              "End": true,
              "Owner": [
                "Finance"
              ]
            },
            "Submitted": {
              "NextState": "Rework",
              "Start": true,
              "Owner": [
                "Seller",
                "Buyer",
                "Accounts"
              ],
              "Visibility": {
                "Purchase": true,
                "Dispatch": true,
                "Accounts": true,
                "Seller": true,
                "Supplychain": true,
                "Finance": true,
                "Buyer": true
              },
              "Rule": null
            },
            "Rework": {
              "Rule": null,
              "NextState": "Approved",
              "Owner": [
                "Finance",
                "Seller",
                "Accounts"
              ],
              "Visibility": {
                "Supplychain": true,
                "Purchase": true,
                "Dispatch": true,
                "Accounts": true,
                "Buyer": true,
                "Finance": true,
                "Seller": true
              }
            }
          },
          "Visibility": {
            "Dispatch": true,
            "Finance": true,
            "Accounts": true,
            "Seller": true,
            "Supplychain": true,
            "Buyer": true,
            "Purchase": true
          }
        },
        "Payment": {
          "Desc": "Payment",
          "NextState": "DigitalReceipt",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "Owner": [
            "Buyer"
          ],
          "Props": null
        },
        "Orders": {
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "Props": null,
          "Desc": "Orders",
          "NextState": "Invoice",
          "AttachStates": [
            "AcceptNote"
          ],
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {}
        },
        "Invoice": {
          "Props": {
            "Edit": true,
            "Flip": false,
            "diff": {
              "to": "OrderedItems.I_Quantity",
              "from": "OrderedItems.I_Quantity"
            }
          },
          "Desc": "Invoice",
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "NextState": "Payment",
          "AttachStates": [],
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Seller",
            "Dispatch",
            "Accounts",
            "Buyer"
          ]
        },
        "PurchaseReq": {
          "Desc": "Purchase Requisition",
          "NextState": "Contract",
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "Props": null
        }
      },
      "installed": 1,
      "orgParamID": "0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
      "smID": "public:0xe42ee5a9d5b19343925ed266043fbcfe1bce482f3eb5248f613a7a88c51e0841"
    },
    "POAmendment":{
      "_id": "public:0x5b09957eb37d348c6bb00cb426e4e9acce909222f01fecb647023ed76ad9a24e_POAmendment",
      "AppType": "CommerceSM",
      "Base_sm": "@statemachine/extendedCommerceSM:public:0x161f0430cae79713cda4e848416f2f561704048d5ac40d6ed0f5829fda2ac1a7",
      "Branch": false,
      "Category": "Apps",
      "Desc": "The Core Protocol Commerce StateMachine PO Amendment for OMV Nykaa ",
      "ExchangeParamID": [
        {
          "paramID": "0x5e282dE188b68864e3B140287640c075C46F4fF4",
          "publicKey": "133e15a25b2657b7d3177ca1281a261099db2fdc9993209b853690fc7ce805fbb75fe5fd9bd839509de8a67fde8afc1cf24f3743272f06cf4f1ac87b2a64bf90"
        }
      ],
      "Index": 4,
      "Name": "PO Amendment OMV",
      "Organizations": [
        {
          "Desc": "Buyer",
          "Teams": [
            {
              "Desc": "SCM Internal",
              "Role": "Buyer"
            },
            {
              "Role": "Supplychain",
              "Desc": "Supplychain Head"
            },
            {
              "Role": "Warehouse",
              "Desc": "Warehouse"
            },
            {
              "Role": "Finance",
              "Desc": "Finance"
            }
          ],
          "Name": "Buyer",
          "OrgIndex": "0"
        },
        {
          "Name": "Seller",
          "Desc": "Seller",
          "OrgIndex": "1",
          "Teams": [
            {
              "Desc": "Manufacturer Planner",
              "Role": "Seller"
            },
            {
              "Desc": "Manufacturer Purchase",
              "Role": "Purchase"
            },
            {
              "Role": "Dispatch",
              "Desc": "Manufacturer Dispatch"
            },
            {
              "Role": "Accounts",
              "Desc": "Manufacturer Accounts"
            }
          ]
        }
      ],
      "Props": {
        "BgColor": "#E3F4FD",
        "Icon": 103
      },
      "Roles": [
        "Buyer",
        "Seller",
        "Supplychain",
        "Warehouse",
        "Finance",
        "Purchase",
        "Dispatch",
        "Accounts"
      ],
      "StartAt": "POAmendment",
      "States": {
        "DebitNote": {
          "End": true,
          "Desc": "Debit Note",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Props": null
        },
        "PurchaseReq": {
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "Props": null,
          "Desc": "Purchase Requisition",
          "NextState": "Contract"
        },
        "Invoice": {
          "NextState": "Payment",
          "AttachStates": [
            "GRN",
            "DebitNote",
            "CreditNote"
          ],
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Seller"
          ],
          "Props": null,
          "Desc": "Invoice",
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          }
        },
        "CreditNote": {
          "Desc": "Credit Note",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "Props": null,
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "End": true
        },
        "Contract": {
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer",
            "Seller"
          ],
          "Props": null,
          "Desc": "Contract",
          "NextState": "Orders",
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          }
        },
        "Payment": {
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "Owner": [
            "Buyer"
          ],
          "Props": null,
          "Desc": "Payment",
          "NextState": "DigitalReceipt",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "SubStates": {}
        },
        "DigitalReceipt": {
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Seller"
          ],
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "Props": null,
          "End": true,
          "Desc": "Digital Receipt"
        },
        "History": {
          "SubStates": {},
          "Visibility": {
            "Supplychain": true,
            "Finance": true,
            "Warehouse": true,
            "Buyer": true,
            "Seller": true
          },
          "Owner": [],
          "Props": null,
          "End": true,
          "Desc": "History",
          "Schema": ""
        },
        "Orders": {
          "NextState": "Invoice",
          "AttachStates": [
            "AcceptNote",
            "POAmendment"
          ],
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Props": null,
          "Desc": "Orders"
        },
        "GRN": {
          "Props": null,
          "End": true,
          "Desc": "GRN",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          }
        },
        "AcceptNote": {
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Owner": [
            "Seller"
          ],
          "Props": null,
          "End": true,
          "Desc": "Accept Note"
        },
        "POAmendment": {
          "Schema": "@schema/Commerce:public:0x8d8ae3e6f422523701e589c825cb523f62453e86ffd8675e90a7d8ec5ccce310",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {
            "Pending": {
              "Start": true,
              "NextState": "Approved",
              "Owner": [
                "Buyer"
              ],
              "Visibility": {
                "Seller": true,
                "Supplychain": true,
                "Finance": true,
                "Warehouse": true,
                "Buyer": true,
                "Purchase": true,
                "Dispatch": true,
                "Accounts": true
              },
              "Rule": null
            },
            "Approved": {
              "End": true,
              "Owner": [
                "Buyer"
              ],
              "Visibility": {
                "Buyer": true,
                "Seller": true,
                "Supplychain": true,
                "Finance": true,
                "Purchase": true,
                "Dispatch": true,
                "Accounts": true,
                "Warehouse": true
              },
              "Rule": null
            }
          },
          "Visibility": {
            "Dispatch": true,
            "Accounts": true,
            "Supplychain": true,
            "Finance": true,
            "Warehouse": true,
            "Buyer": true,
            "Seller": true,
            "Purchase": true
          },
          "Props": {
            "Edit": true,
            "Flip": true
          },
          "Desc": "PO Amendment",
          "End": true,
          "AttachStates": [
            "History"
          ]
        }
      },
      "installed": 1,
      "orgParamID": "0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
      "smID": "public:0x5b09957eb37d348c6bb00cb426e4e9acce909222f01fecb647023ed76ad9a24e"
    },
    "Production":{
      "_id": "public:0x56ab67f5e470998c82a64b9477a789d24f1c9f37406f01f4163b06f58acc11f0_Orders",
      "AppType": "CommerceSM",
      "Base_sm": "@statemachine/extendedCommerceSM:public:0x161f0430cae79713cda4e848416f2f561704048d5ac40d6ed0f5829fda2ac1a7",
      "Branch": false,
      "Category": "Apps",
      "Desc": "The Core Protocol Commerce StateMachine Production OMV Nykaa",
      "ExchangeParamID": [
        {
          "paramID": "0x5e282dE188b68864e3B140287640c075C46F4fF4",
          "publicKey": "133e15a25b2657b7d3177ca1281a261099db2fdc9993209b853690fc7ce805fbb75fe5fd9bd839509de8a67fde8afc1cf24f3743272f06cf4f1ac87b2a64bf90"
        }
      ],
      "Index": 2,
      "Name": "Production OMV",
      "Organizations": [
        {
          "Name": "Buyer",
          "Desc": "Buyer",
          "Teams": [
            {
              "Role": "Buyer",
              "Desc": "SCM Internal"
            },
            {
              "Role": "Supplychain",
              "Desc": "Supplychain Head"
            },
            {
              "Desc": "Warehouse",
              "Role": "Warehouse"
            },
            {
              "Role": "Finance",
              "Desc": "Finance"
            }
          ]
        },
        {
          "Name": "Seller",
          "Desc": "Seller",
          "Teams": [
            {
              "Role": "Seller",
              "Desc": "Manufacturer Planner"
            },
            {
              "Role": "Purchase",
              "Desc": "Manufacturer Purchase"
            },
            {
              "Desc": "Manufacturer Dispatch",
              "Role": "Dispatch"
            },
            {
              "Desc": "Manufacturer Accounts",
              "Role": "Accounts"
            }
          ]
        }
      ],
      "Props": {
        "Icon": 103,
        "BgColor": "#E3F4FD"
      },
      "Roles": [
        "Buyer",
        "Seller",
        "Supplychain",
        "Warehouse",
        "Finance",
        "Purchase",
        "Dispatch",
        "Accounts"
      ],
      "StartAt": "Orders",
      "Start_sm": "@statemachine/CommerceSM:public:0x3c0a4cdbbb5ef4071248c043224ee5125a3449982390996eec6a17649b9f1c34",
      "States": {
        "History": {
          "SubStates": {},
          "Visibility": {
            "Finance": true,
            "Supplychain": true,
            "Warehouse": true,
            "Seller": true,
            "Buyer": true
          },
          "Desc": "History",
          "End": true,
          "Schema": "",
          "Owner": []
        },
        "DispatchIntimation": {
          "Owner": [
            "Buyer",
            "Seller",
            "Dispatch"
          ],
          "CollectionLoc": "DispatchIntimation_0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
          "SubStates": {},
          "Desc": "Dispatch Intimation",
          "Props": {
            "diff": {
              "from": "OrderedItems.I_Quantity",
              "to": "OrderedItems.I_Quantity"
            },
            "Flip": true,
            "Edit": true
          },
          "Schema": "@schema/Commerce:public:0x1957c8946fbcff0084d1fabe73dca1b4bf340ec4f3ad419d2ab5480e2c284335",
          "AttachStates": [
            "POAmendment",
            "CostingSheet"
          ],
          "Visibility": {
            "Warehouse": true,
            "Finance": true,
            "Purchase": true,
            "Dispatch": true,
            "Accounts": true,
            "Seller": true,
            "Buyer": true,
            "Supplychain": true
          },
          "NextState": "Invoice"
        },
        "Invoice": {
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Seller",
            "Buyer",
            "Accounts",
            "Dispatch"
          ],
          "Props": null,
          "Desc": "Invoice",
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "NextState": "Payment",
          "AttachStates": [
            "GRN",
            "DebitNote",
            "CreditNote"
          ]
        },
        "DigitalReceipt": {
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Props": null,
          "End": true,
          "Desc": "Digital Receipt",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Seller"
          ]
        },
        "Contract": {
          "NextState": "Orders",
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer",
            "Seller"
          ],
          "Props": null,
          "Desc": "Contract"
        },
        "Payment": {
          "Props": null,
          "Desc": "Payment",
          "NextState": "DigitalReceipt",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "Owner": [
            "Buyer"
          ]
        },
        "Orders": {
          "NextState": "VendorPlanUpload",
          "AttachStates": [
            "History"
          ],
          "Schema": "@schema/Commerce:public:0xac519bc2e98a4d6e0c0dd90df0a04b7203899875755f57ba35715529c5089b13",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {},
          "Visibility": {
            "Warehouse": true,
            "Seller": true,
            "Buyer": true,
            "Purchase": true,
            "Dispatch": true,
            "Accounts": true,
            "Supplychain": true
          },
          "Props": {
            "diff": {
              "from": "OrderedItems.I_Quantity",
              "to": "OrderedItems.I_Quantity"
            },
            "Edit": true,
            "Flip": true
          },
          "Desc": "Orders"
        },
        "PurchaseReq": {
          "NextState": "Contract",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "Props": null,
          "Desc": "Purchase Requisition"
        },
        "POAmendment": {
          "Props": {
            "diff": {
              "from": "OrderedItems.I_Quantity",
              "to": "OrderedItems.I_Quantity"
            },
            "Edit": true
          },
          "SubStates": {},
          "End": true,
          "Desc": "PO Amendment",
          "Schema": "@schema/Commerce:public:0xac519bc2e98a4d6e0c0dd90df0a04b7203899875755f57ba35715529c5089b13",
          "Visibility": {
            "Buyer": true,
            "Purchase": true,
            "Dispatch": true,
            "Accounts": true,
            "Finance": true,
            "Supplychain": true,
            "Warehouse": true,
            "Seller": true
          },
          "Owner": [
            "Buyer"
          ]
        },
        "GRN": {
          "Props": null,
          "End": true,
          "Desc": "GRN",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          }
        },
        "CreditNote": {
          "Owner": [
            "Buyer"
          ],
          "Props": null,
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "End": true,
          "Desc": "Credit Note",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9"
        },
        "VendorPlanUpload": {
          "Schema": "@schema/Commerce:public:0xc37fd26db8fd1bfabebdb47d3c40fa5c9cb1a3e12d24d2e706a46394e308f12c",
          "CollectionLoc": "VendorPlanUpload_0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
          "SubStates": {},
          "Desc": "Vendor Plan Upload Upload ",
          "Owner": [
            "Seller",
            "Buyer"
          ],
          "NextState": "DispatchIntimation",
          "Props": {
            "Edit": true,
            "Flip": true,
            "diff": {
              "to": "OrderedItems.I_Quantity",
              "from": "OrderedItems.I_Quantity"
            }
          },
          "Visibility": {
            "Supplychain": true,
            "Buyer": true,
            "Seller": true,
            "Purchase": true,
            "Dispatch": true,
            "Accounts": true
          },
          "AttachStates": []
        },
        "DebitNote": {
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "Props": null,
          "End": true,
          "Desc": "Debit Note",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ]
        },
        "CostingSheet": {
          "Visibility": {
            "Supplychain": true,
            "Buyer": true,
            "Finance": true,
            "Purchase": true,
            "Dispatch": true,
            "Accounts": true,
            "Seller": true
          },
          "AttachStates": [],
          "Owner": [
            "Seller",
            "Buyer",
            "Finance",
            "Accounts"
          ],
          "End": true,
          "Desc": "Costing Sheet",
          "Schema": "@schema/Commerce:public:0x07c995cfe29592d5f355729489296c46662c42a9a7de94122ff60255b475930e",
          "Props": {
            "Flip": true,
            "diff": {
              "from": "OrderedItems.I_Quantity",
              "to": "OrderedItems.I_Quantity"
            },
            "Edit": true
          },
          "SubStates": {
            "Submitted": {
              "Rule": null,
              "NextState": "Rework",
              "Start": true,
              "Owner": [
                "Seller",
                "Buyer",
                "Accounts"
              ],
              "Visibility": {
                "Accounts": true,
                "Finance": true,
                "Seller": true,
                "Supplychain": true,
                "Buyer": true,
                "Purchase": true,
                "Dispatch": true
              }
            },
            "Rework": {
              "Owner": [
                "Finance",
                "Seller",
                "Accounts"
              ],
              "Visibility": {
                "Seller": true,
                "Supplychain": true,
                "Purchase": true,
                "Dispatch": true,
                "Accounts": true,
                "Finance": true,
                "Buyer": true
              },
              "Rule": null,
              "NextState": "Approved"
            },
            "Approved": {
              "Rule": null,
              "End": true,
              "Owner": [
                "Finance"
              ],
              "Visibility": {
                "Accounts": true,
                "Finance": true,
                "Buyer": true,
                "Seller": true,
                "Supplychain": true,
                "Purchase": true,
                "Dispatch": true
              }
            }
          }
        }
      },
      "installed": 1,
      "orgParamID": "0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
      "smID": "public:0x56ab67f5e470998c82a64b9477a789d24f1c9f37406f01f4163b06f58acc11f0"
    },
    "GRN":{
      "_id": "public:0x550882a6e3f634a20d81a4a45649850e3f1b16854b695335b3d819ee12b73334_GRN",
      "AppType": "CommerceSM",
      "Base_sm": "@statemachine/extendedCommerceSM:public:0x161f0430cae79713cda4e848416f2f561704048d5ac40d6ed0f5829fda2ac1a7",
      "Branch": false,
      "Category": "Apps",
      "Desc": "The Core Protocol Commerce StateMachine GRN for OMV Nykaa",
      "ExchangeParamID": [
        {
          "paramID": "0x5e282dE188b68864e3B140287640c075C46F4fF4",
          "publicKey": "133e15a25b2657b7d3177ca1281a261099db2fdc9993209b853690fc7ce805fbb75fe5fd9bd839509de8a67fde8afc1cf24f3743272f06cf4f1ac87b2a64bf90"
        }
      ],
      "Index": 6,
      "Name": "GRN OMV",
      "Organizations": [
        {
          "Name": "Buyer",
          "Desc": "Buyer",
          "Teams": [
            {
              "Desc": "SCM Internal",
              "Role": "Buyer"
            },
            {
              "Role": "Supplychain",
              "Desc": "Supplychain Head"
            },
            {
              "Role": "Warehouse",
              "Desc": "Warehouse"
            },
            {
              "Role": "Finance",
              "Desc": "Finance"
            }
          ]
        },
        {
          "Desc": "Seller",
          "Teams": [
            {
              "Role": "Seller",
              "Desc": "Manufacturer Planner"
            },
            {
              "Role": "Purchase",
              "Desc": "Manufacturer Purchase"
            },
            {
              "Role": "Dispatch",
              "Desc": "Manufacturer Dispatch"
            },
            {
              "Desc": "Manufacturer Accounts",
              "Role": "Accounts"
            }
          ],
          "Name": "Seller"
        }
      ],
      "Props": {
        "Icon": 102,
        "BgColor": "#E7F7FF"
      },
      "Roles": [
        "Buyer",
        "Seller",
        "Supplychain",
        "Warehouse",
        "Finance",
        "Purchase",
        "Dispatch",
        "Accounts"
      ],
      "StartAt": "GRN",
      "Start_sm": "@statemachine/CommerceSM:public:0xd17fbf90fdb69e13fe2563abc4b6d722e913e6372f72850f4d524edefe6ddd74",
      "States": {
        "DebitNote": {
          "Desc": "Debit Note",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "Props": null,
          "End": true
        },
        "GRN": {
          "Schema": "@schema/Commerce:public:0x78d53d8551afe047391f32e439a8ce4de69e978dc96e8bab1d38ce450ce32e8c",
          "Owner": [
            "Warehouse"
          ],
          "SubStates": {},
          "Visibility": {
            "Dispatch": true,
            "Accounts": true,
            "Seller": true,
            "Buyer": true,
            "Supplychain": true,
            "Warehouse": true,
            "Finance": true,
            "Purchase": true
          },
          "AttachStates": [
            "History"
          ],
          "Props": {
            "Edit": true,
            "Flip": false
          },
          "End": true,
          "Desc": "GRN"
        },
        "AcceptNote": {
          "End": true,
          "Desc": "Accept Note",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Owner": [
            "Seller"
          ],
          "Props": null
        },
        "Orders": {
          "NextState": "Invoice",
          "AttachStates": [
            "AcceptNote"
          ],
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Props": null,
          "Desc": "Orders"
        },
        "PurchaseReq": {
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Props": null,
          "Desc": "Purchase Requisition",
          "NextState": "Contract",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {}
        },
        "CreditNote": {
          "Props": null,
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "End": true,
          "Desc": "Credit Note",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ]
        },
        "Contract": {
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Seller"
          ],
          "Props": null,
          "Desc": "Contract",
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "NextState": "Orders",
          "AttachStates": [
            "GRN",
            "DebitNote",
            "CreditNote"
          ]
        },
        "History": {
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true,
            "Supplychain": true,
            "Warehouse": true,
            "Finance": true
          },
          "Owner": [],
          "Props": null,
          "End": true,
          "Desc": "History",
          "Schema": ""
        },
        "Payment": {
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Owner": [
            "Buyer"
          ],
          "Props": null,
          "Desc": "Payment",
          "NextState": "DigitalReceipt"
        },
        "DigitalReceipt": {
          "Props": null,
          "End": true,
          "Desc": "Digital Receipt",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Seller"
          ],
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          }
        },
        "Invoice": {
          "Props": null,
          "Desc": "Invoice",
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "NextState": "Payment",
          "AttachStates": [
            "GRN",
            "DebitNote",
            "CreditNote"
          ],
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Seller"
          ]
        }
      },
      "installed": 1,
      "orgParamID": "0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
      "smID": "public:0x550882a6e3f634a20d81a4a45649850e3f1b16854b695335b3d819ee12b73334"
    },
    "Plan":{
      "_id": "public:0x3c0a4cdbbb5ef4071248c043224ee5125a3449982390996eec6a17649b9f1c34_Contract",
      "AppType": "CommerceSM",
      "Base_sm": "@statemachine/extendedCommerceSM:public:0x161f0430cae79713cda4e848416f2f561704048d5ac40d6ed0f5829fda2ac1a7",
      "Branch": false,
      "Category": "Apps",
      "Desc": "The Core Protocol Commerce StateMachine Plan OMV Nykaa",
      "ExchangeParamID": [
        {
          "publicKey": "133e15a25b2657b7d3177ca1281a261099db2fdc9993209b853690fc7ce805fbb75fe5fd9bd839509de8a67fde8afc1cf24f3743272f06cf4f1ac87b2a64bf90",
          "paramID": "0x5e282dE188b68864e3B140287640c075C46F4fF4"
        }
      ],
      "Index": 1,
      "Name": "Plan OMV",
      "Organizations": [
        {
          "Name": "Buyer",
          "Desc": "Buyer",
          "Teams": [
            {
              "Desc": "SCM Internal",
              "Role": "Buyer"
            },
            {
              "Role": "Supplychain",
              "Desc": "Supplychain Head"
            },
            {
              "Desc": "Warehouse",
              "Role": "Warehouse"
            },
            {
              "Desc": "Finance",
              "Role": "Finance"
            }
          ]
        },
        {
          "Name": "Seller",
          "Desc": "Seller",
          "Teams": [
            {
              "Role": "Seller",
              "Desc": "Manufacturer Planner"
            },
            {
              "Role": "Purchase",
              "Desc": "Manufacturer Purchase"
            },
            {
              "Role": "Dispatch",
              "Desc": "Manufacturer Dispatch"
            },
            {
              "Role": "Accounts",
              "Desc": "Manufacturer Accounts"
            }
          ]
        }
      ],
      "Props": {
        "BgColor": "#E7F7FF",
        "Icon": 102
      },
      "Roles": [
        "Buyer",
        "Seller",
        "Supplychain",
        "Warehouse",
        "Finance",
        "Purchase",
        "Dispatch",
        "Accounts"
      ],
      "StartAt": "Contract",
      "States": {
        "PurchaseReq": {
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Props": null,
          "Desc": "Purchase Requisition",
          "NextState": "Contract"
        },
        "DigitalReceipt": {
          "Owner": [
            "Seller"
          ],
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Props": null,
          "End": true,
          "Desc": "Digital Receipt",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9"
        },
        "Contract": {
          "SubStates": {
            "SCMApproved": {
              "End": true,
              "Owner": [
                "Supplychain"
              ],
              "Visibility": {
                "Buyer": true,
                "Supplychain": true
              },
              "MicroStates": {
                "Approve": {
                  "Start": true,
                  "Owner": [
                    "Supplychain"
                  ],
                  "NextState": "Reject",
                  "Desc": "Approve"
                },
                "Reject": {
                  "End": true,
                  "Desc": "Reject",
                  "Owner": [
                    "Supplychain"
                  ]
                }
              },
              "Rule": null
            },
            "Upload": {
              "Rule": null,
              "Start": true,
              "NextState": "SCMApproved",
              "Owner": [
                "Buyer"
              ],
              "Visibility": {
                "Supplychain": true,
                "Buyer": true
              }
            }
          },
          "AttachStates": [
            "History"
          ],
          "Schema": "@schema/Commerce:public:0x3d55b908dc90d22b8272c7f0595f87b0c276fbbab5682fb21ea5c346bced0c2a",
          "NextState": "Orders",
          "End": true,
          "Desc": "Plan",
          "Props": {
            "Edit": true
          },
          "Visibility": {
            "Supplychain": true,
            "Buyer": true
          },
          "Owner": [
            "Buyer",
            "Supplychain"
          ]
        },
        "Payment": {
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Owner": [
            "Buyer"
          ],
          "Props": null,
          "Desc": "Payment",
          "NextState": "DigitalReceipt",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "SubStates": {}
        },
        "AcceptNote": {
          "End": true,
          "Desc": "Accept Note",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Owner": [
            "Seller"
          ],
          "Props": null
        },
        "Invoice": {
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Seller"
          ],
          "Props": null,
          "Desc": "Invoice",
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "NextState": "Payment",
          "AttachStates": [
            "GRN",
            "DebitNote",
            "CreditNote"
          ]
        },
        "CreditNote": {
          "Owner": [
            "Buyer"
          ],
          "Props": null,
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "End": true,
          "Desc": "Credit Note",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9"
        },
        "Orders": {
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Props": null,
          "Desc": "Orders",
          "NextState": "Invoice",
          "AttachStates": [
            "AcceptNote"
          ],
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ]
        },
        "History": {
          "End": true,
          "Desc": "History",
          "Schema": "",
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Supplychain": true
          },
          "Owner": [],
          "Props": null
        },
        "DebitNote": {
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Props": null,
          "End": true,
          "Desc": "Debit Note",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {}
        },
        "GRN": {
          "Desc": "GRN",
          "Schema": "@schema/Commerce:public:0x25c87a707f6ba5dadbfdff760edcb5f3a9445dc1257df5952da814bf237888a9",
          "Owner": [
            "Buyer"
          ],
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "Props": null,
          "End": true
        }
      },
      "installed": 1,
      "orgParamID": "0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
      "smID": "public:0x3c0a4cdbbb5ef4071248c043224ee5125a3449982390996eec6a17649b9f1c34"
    },
    "InventoryReport":{
      "_id": "public:0x0df0df650f908bfcbc1a4b01704678c62d4b20b07972fe0093fea22c774d06a2_Contact",
      "AppType": "ContactSM",
      "Base_sm": "@statemachine/extendedCommerceSM:public:0x161f0430cae79713cda4e848416f2f561704048d5ac40d6ed0f5829fda2ac1a7",
      "Branch": false,
      "Category": "Apps",
      "Desc": "The Core Protocol Commerce StateMachine for OMV",
      "ExchangeParamID": [
        {
          "paramID": "0x5e282dE188b68864e3B140287640c075C46F4fF4",
          "publicKey": "133e15a25b2657b7d3177ca1281a261099db2fdc9993209b853690fc7ce805fbb75fe5fd9bd839509de8a67fde8afc1cf24f3743272f06cf4f1ac87b2a64bf90"
        }
      ],
      "Index": 9,
      "Name": "Inventory Report OMV",
      "Organizations": [
        {
          "Desc": "Buyer",
          "Teams": [
            {
              "Role": "Buyer",
              "Desc": "SCM Internal"
            },
            {
              "Desc": "Supplychain Head",
              "Role": "Supplychain"
            },
            {
              "Role": "Warehouse",
              "Desc": "Warehouse"
            },
            {
              "Desc": "Finance",
              "Role": "Finance"
            }
          ],
          "Name": "Buyer"
        },
        {
          "Desc": "Seller",
          "Teams": [
            {
              "Role": "Seller",
              "Desc": "Manufacturer Planner"
            },
            {
              "Desc": "Manufacturer Purchase",
              "Role": "Purchase"
            },
            {
              "Role": "Dispatch",
              "Desc": "Manufacturer Dispatch"
            },
            {
              "Role": "Accounts",
              "Desc": "Manufacturer Accounts"
            }
          ],
          "Name": "Seller"
        }
      ],
      "Props": {
        "Icon": 102,
        "BgColor": "#E7F7FF"
      },
      "Roles": [
        "Buyer",
        "Seller",
        "Supplychain",
        "Warehouse",
        "Finance",
        "Purchase",
        "Dispatch",
        "Accounts"
      ],
      "StartAt": "InventoryReport",
      "States": {
        "InventoryReport": {
          "Visibility": {
            "Dispatch": true,
            "Accounts": true,
            "Buyer": true,
            "Seller": true,
            "Supplychain": true,
            "Purchase": true
          },
          "Props": {
            "Edit": true
          },
          "End": true,
          "Desc": "Inventory Report",
          "SubStates": {},
          "AttachStates": [
            "History"
          ],
          "Schema": "@schema/Commerce:public:0xa58dc6785ee91581464cd8dd49af149dd7960799719edaeb423fddd2048afaa5",
          "Owner": [
            "Seller",
            "Buyer",
            "Purchase"
          ]
        },
        "History": {
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Supplychain": true,
            "Buyer": true
          },
          "Owner": [],
          "Props": null,
          "End": true,
          "Desc": "History",
          "Schema": ""
        },
        "Inactive": {
          "Owner": [
            "Seller",
            "Buyer"
          ],
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "End": true,
          "Props": null,
          "Desc": "Inactive",
          "Schema": "@schema/Contact:public:0x9e2a3a3d6cd82dd1cc4e54c4688ebb76f7b16a14f622934b4ed9bbe8396282aa"
        },
        "Invite": {
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "Desc": "Invite Contact",
          "Schema": "@schema/Contact:public:0x9e2a3a3d6cd82dd1cc4e54c4688ebb76f7b16a14f622934b4ed9bbe8396282aa",
          "NextState": "Approve",
          "Owner": [
            "Buyer",
            "Seller"
          ],
          "Props": null,
          "SubStates": {}
        },
        "Approve": {
          "NextState": "Inactive",
          "Props": null,
          "Desc": "Approve Contact",
          "Schema": "@schema/Contact:public:0x9e2a3a3d6cd82dd1cc4e54c4688ebb76f7b16a14f622934b4ed9bbe8396282aa",
          "Owner": [
            "Seller",
            "Buyer"
          ],
          "SubStates": {},
          "Visibility": {
            "Seller": true,
            "Buyer": true
          },
          "AttachStates": [
            "InventoryReport"
          ]
        }
      },
      "installed": 1,
      "orgParamID": "0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
      "smID": "public:0x0df0df650f908bfcbc1a4b01704678c62d4b20b07972fe0093fea22c774d06a2"
    },
    "Catalogue":{
      "_id": "public:0xcca341f63dfbde5965095919b2f56a133fb2f506d0790505450f2115e3b97593",
      "AppType": "CatalogueSM",
      "Base_sm": "@statemachine/extendedCatalogueSM:public:0x7d041a169e27b99b0149bdc5d7671fe0978fe2d688e158fd78cc8c46f4f5035e",
      "Branch": true,
      "Category": "Apps",
      "Desc": "Catalogue for OMV Nykaa",
      "ExchangeParamID": [
        {
          "paramID": "0x5e282dE188b68864e3B140287640c075C46F4fF4",
          "publicKey": "133e15a25b2657b7d3177ca1281a261099db2fdc9993209b853690fc7ce805fbb75fe5fd9bd839509de8a67fde8afc1cf24f3743272f06cf4f1ac87b2a64bf90"
        }
      ],
      "Index": 8,
      "Name": "Catalogue",
      "Organizations": [
        {
          "Desc": "Buyer",
          "Teams": [
            {
              "Role": "Buyer",
              "Desc": "SCM Internal"
            },
            {
              "Desc": "Supplychain Head",
              "Role": "Supplychain"
            },
            {
              "Role": "Warehouse",
              "Desc": "Warehouse"
            },
            {
              "Desc": "Finance",
              "Role": "Finance"
            }
          ],
          "Name": "Buyer"
        }
      ],
      "Props": {
        "Icon": 101,
        "Category": "Purchases",
        "BgColor": "#E7F7FF"
      },
      "Roles": [
        "Buyer",
        "Supplychain",
        "Warehouse",
        "Finance"
      ],
      "StartAt": "AddCatalogue",
      "States": {
        "AddCatalogue": {
          "Schema": "@schema/Catalogue:public:0x8b5a4bb829d9129307669cc2e0cb5f66bf5e79902b5d293535ea172ede605664",
          "Owner": [
            "Buyer",
            "Supplychain",
            "Warehouse",
            "Finance"
          ],
          "End": true,
          "Props": null,
          "Desc": "Add Catalogue",
          "SubStates": {},
          "Visibility": {
            "Buyer": true,
            "Supplychain": true,
            "Warehouse": true,
            "Finance": true
          }
        }
      },
      "orgParamID": "0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
      "smID": "public:0xcca341f63dfbde5965095919b2f56a133fb2f506d0790505450f2115e3b97593"
    },
    "PartnerEmpanelment":{
      "_id": "public:0xde4e91be9dae90394b30606c226fbe856a21f13f44ad849f5ce43e4bb23727c3_Invite",
      "AppType": "ContactSM",
      "Base_sm": "@statemachine/extendedContactSM:public:0x835194aecfce4c2d4a20a01996cdd03953f0e0babc2667fda5981febd22cc519",
      "Branch": false,
      "Category": "Apps",
      "Desc": "PARAM Contact protocol statemachine for OMV",
      "ExchangeParamID": [
        {
          "paramID": "0x5e282dE188b68864e3B140287640c075C46F4fF4",
          "publicKey": "133e15a25b2657b7d3177ca1281a261099db2fdc9993209b853690fc7ce805fbb75fe5fd9bd839509de8a67fde8afc1cf24f3743272f06cf4f1ac87b2a64bf90"
        }
      ],
      "Index": 7,
      "Name": "Partners",
      "Organizations": [
        {
          "Teams": [],
          "Name": "Buyer",
          "Desc": "Buyer"
        },
        {
          "Teams": [],
          "Name": "Seller",
          "Desc": "Seller"
        }
      ],
      "Props": {
        "BgColor": "#DAF3DE",
        "Icon": 100,
        "Category": "Purchases"
      },
      "Roles": [
        "Buyer",
        "Seller"
      ],
      "StartAt": "Invite",
      "States": {
        "Invite": {
          "Desc": "Invite Contact",
          "Schema": "@schema/Contact:public:0x7e5581b9fc141cc375778207b5584ee553d0bed81e368f283d9dc0b01ead2a1b",
          "NextState": "Approve",
          "Owner": [
            "Buyer",
            "Seller"
          ],
          "Props": null
        },
        "Approve": {
          "Props": null,
          "AttachStates": [
            "InventoryReport"
          ],
          "Desc": "Approve Contact",
          "Schema": "@schema/Contact:public:0x7e5581b9fc141cc375778207b5584ee553d0bed81e368f283d9dc0b01ead2a1b",
          "Owner": [
            "Seller",
            "Buyer"
          ],
          "End": true
        },
        "InventoryReport": {
          "End": true,
          "Desc": "Inventory Report",
          "Schema": "@schema/Contact:public:0xa58dc6785ee91581464cd8dd49af149dd7960799719edaeb423fddd2048afaa5",
          "Owner": [
            "Buyer"
          ],
          "Visibility": {
            "Buyer": true,
            "Seller": true
          },
          "Props": null
        },
        "Inactive": {
          "End": true,
          "Props": null,
          "Desc": "Inactive",
          "Schema": "@schema/Contact:public:0x7e5581b9fc141cc375778207b5584ee553d0bed81e368f283d9dc0b01ead2a1b",
          "Owner": [
            "Seller",
            "Buyer"
          ]
        }
      },
      "orgParamID": "0x44568D2535f2DEf8fEEC08d5FbC9c8F1ae56D5A7",
      "smID": "public:0xde4e91be9dae90394b30606c226fbe856a21f13f44ad849f5ce43e4bb23727c3"
    }
  }
