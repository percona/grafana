export default 'apiVersion: v1\nclusters:\n- cluster:\n    certificate-authority-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURCakNDQWU2Z0F3SUJBZ0lCQVRBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwdGFXNXAKYTNWaVpVTkJNQjRYRFRJeU1ETXlNVEV6TXprek1sb1hEVE15TURNeE9URXpNemt6TWxvd0ZURVRNQkVHQTFVRQpBeE1LYldsdWFXdDFZbVZEUVRDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTkNxClJmd2NjMEtwYnp6Sk4vSEo2ZzJpeGtibmRPSnVBTGFDMXlwTTBla3hJOCs5RWgxMjVwSjJnZFFzRjhzYWNRYUIKSmZPSWxPdHRzZHlNbmVYV3V4cjVOd29MZVhhYUtSd2U2Kzl4MlZhQUtTbSsySGo4Y1lvb3ZqZlc5RjU0NUFpdwpoa0tDcm02Tm5PZjlIaC9KdkR6clM5V1U0eDM5S25XVE8xcnVqaWdQR3RmYXprR2haSnpMcDFzZ2hXTWViSHA0CmR3QXpkTjB6blRSOWN1Ykd1UXRmZmxPd3BGTU50L0RRNFdVWmEzVS9SL09ZNlg1M3JMNVF2ZjRuTFptRlhmUnoKMldpbEZHNVhUbnVCZzlKZ3FUang1QWpOOGpveFVJMGtEdEFtMW9aOVJucjNJdEEzQm0rTlRKeVQxRkh1K0xYNAp6V2ZSd2hQcXpXY3VXV3FzbTlzQ0F3RUFBYU5oTUY4d0RnWURWUjBQQVFIL0JBUURBZ0trTUIwR0ExVWRKUVFXCk1CUUdDQ3NHQVFVRkJ3TUNCZ2dyQmdFRkJRY0RBVEFQQmdOVkhSTUJBZjhFQlRBREFRSC9NQjBHQTFVZERnUVcKQkJUNmlnbDNZaHJyYU1WYUtxNzU2QnhGUUpOQ3pqQU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFWZkRJS1Z3MQpCU3JHUFRCR2ZkMCtHczhpR1JvUnNaVGluLzB2dnluL3cyTi9KS05hQjZLSmZqTS9oWDlNRHJTOXdCaHlWMzUxCkh3Z0dWeUVIOHlwY2RYRGR6MUx0azRaRzlhUS9FeW5ZV2tlMkpaem5JSS94Uzc5ZWxCVjhCVlpnbkxEWW5ESWcKQW4zTExnYVRnbEVSSXoyRDRYdG9tSUdWOUxJYzhUSWFIT0xrekpIN2NweFpEM3FzUWh0VEJDR0Nyd2wranh1Mgp1aENpNkd4QzVRUm1GTXBzMEFWYkR2cUk5Nk9kY0o3RUpkZCtsOVplVitKTnJsbjQ3K1A5N1dwYSsyU09LM282CkNtRjlrd25TRXZMTlRRanR0emIvSURWZmtPbFRlSHpUNXdMeGtIRW5FcTdxL0JIYXhTU2d2dFRmT0FveFV5MHQKZDBrV05HVmE5MXlPNFE9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==\n    extensions:\n    - extension:\n        last-update: Thu, 28 Jul 2022 19:42:19 +04\n        provider: minikube.sigs.k8s.io\n        version: v1.24.0\n      name: cluster_info\n    server: https://192.168.49.2:8443\n  name: minikube\ncontexts:\n- context:\n    cluster: minikube\n    extensions:\n    - extension:\n        last-update: Thu, 28 Jul 2022 19:42:19 +04\n        provider: minikube.sigs.k8s.io\n        version: v1.24.0\n      name: context_info\n    namespace: default\n    user: minikube\n  name: minikube\ncurrent-context: minikube\nkind: Config\npreferences: {}\nusers:\n- name: minikube\n  user:\n    client-certificate-data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURJVENDQWdtZ0F3SUJBZ0lCQWpBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwdGFXNXAKYTNWaVpVTkJNQjRYRFRJeU1EY3lOekUxTkRJd04xb1hEVEkxTURjeU56RTFOREl3TjFvd01URVhNQlVHQTFVRQpDaE1PYzNsemRHVnRPbTFoYzNSbGNuTXhGakFVQmdOVkJBTVREVzFwYm1scmRXSmxMWFZ6WlhJd2dnRWlNQTBHCkNTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCQVFEaDN4NnpiSUM5dFZ3aWsrN1REQWx4cXovNXR3SnMKRURWd0RkVStYc1hlendxd3dHSFM2M2c5Sy8yOEVhaCt1bUhwUWhPRUJkYnZrYVFrSlpYb0gvWGoranF4TFhCdgorL0ZrQnNwZ2hQZlNXc3NTRVh0VHBGR2J1Q2Z5a0NTcEMvMmNKN2ZTa2tncVRNWWdTamZYbFJtVmM2bStSeEROCkF6djB2TEZGYzE5MHI5YWM4dzRrcDk0YUZNdG96RlBVcm1jZ2xOMnppVmkxRFNoN0E1Q3E1TTZoaUFtM0J0dlUKM3Qrc0w1WE02UnZMMGZVUG5qT2lrOWlYZmdWd1lZU3Q3MEM3ZEhJTHcrdmtwRUFJWlFhVkFMYmwrdHVGYk45bApyOTk2cFk4aWZsbVRBNTBpQm8wT2d1NVNJbXBQcUtXd2ZQUDNkalA1SjBUaWJQK0RDV0c0N0FteEFnTUJBQUdqCllEQmVNQTRHQTFVZER3RUIvd1FFQXdJRm9EQWRCZ05WSFNVRUZqQVVCZ2dyQmdFRkJRY0RBUVlJS3dZQkJRVUgKQXdJd0RBWURWUjBUQVFIL0JBSXdBREFmQmdOVkhTTUVHREFXZ0JUNmlnbDNZaHJyYU1WYUtxNzU2QnhGUUpOQwp6akFOQmdrcWhraUc5dzBCQVFzRkFBT0NBUUVBdms4bEM5aEg5OWZUeXZkT0IyTUdDODY0KzFFaGVVcC9XK3lwClVCdnVXMW9wUVJLLzhaRGVzaE5sUmxkSVhIamdpU2Y1WTZubmtNUTlIcnYxTXQ0YUtKdGlFL3dIdjYveFJYbTUKUFpKbW5pYmFYYVhLQkJvc3JyT1M4RnBWQWh1dUp5SWp2OFNGeE1BWk1kaUpKcnZOVmQzYXIyaVJYdWx6b05kMwp6TEdrRXI3OE5oaVBwVFpxK1dwTEJxVG52TUQreHNUbXJuVHFPdUZoUFRUYVU4ZzJhTkVxWTFIcXYxOVBRZE45Ckl1aDlCVXNyRnI5ZW5UWTJzQlo1b1k2VmFqL0d2ZWVkbEt0RjkvOCtIbzJaYjAvYU9LSkVHaElleHdjT2htcEsKb1JsaExtZGV5VUxoSnNUcUVXcENDMWlmU1BjdWZxMHh3dURwSDBTWld4SjlzOURjMWc9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==\n    client-key-data: LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFcEFJQkFBS0NBUUVBNGQ4ZXMyeUF2YlZjSXBQdTB3d0pjYXMvK2JjQ2JCQTFjQTNWUGw3RjNzOEtzTUJoCjB1dDRQU3Y5dkJHb2ZycGg2VUlUaEFYVzc1R2tKQ1dWNkIvMTQvbzZzUzF3Yi92eFpBYktZSVQzMGxyTEVoRjcKVTZSUm03Z244cEFrcVF2OW5DZTMwcEpJS2t6R0lFbzMxNVVabFhPcHZrY1F6UU03OUx5eFJYTmZkSy9XblBNTwpKS2ZlR2hUTGFNeFQxSzVuSUpUZHM0bFl0UTBvZXdPUXF1VE9vWWdKdHdiYjFON2ZyQytWek9rYnk5SDFENTR6Cm9wUFlsMzRGY0dHRXJlOUF1M1J5QzhQcjVLUkFDR1VHbFFDMjVmcmJoV3pmWmEvZmVxV1BJbjVaa3dPZElnYU4KRG9MdVVpSnFUNmlsc0h6ejkzWXorU2RFNG16L2d3bGh1T3dKc1FJREFRQUJBb0lCQUE3UjRPWE0zTFdWekxISQpHd2RsNXNpNmY3d1dzZVg5T2tSYjQvM3ZvZlA0aWE4SE1HUHlaelU4U2EycFN2RGxzYjdvUXZlS21vdWxkcXVZCmU3bDdQMXJ4OUIvajUxaXhveWo0K1JaVUl4NStMb3pFOE42UURYcTJIb2pmeEVnRExXU3RoblllZXZXcmkrUmEKZWtkKzFPcmxaK0hBTCs0RHBFOXVnZ01ZaXM3UkN5bXVHczdPeFdOd2c5YUh2YmxIc3NwREIzb0xiMnRid3JFLwpaUVdHbHV2UnV3bjUwQ1dTSXg1SmNudjhPcmQ0ck5OWGMvNjdic2c3VmRiQlJ4T3V2eW14NnRIM1hVUC9sVU9GCmk5ZzVOeVFtZzh5S3lFNyt0L2MzS2p0SWVCb1hKcXhCZ0dEZk9aeWJwc0FseVA1OUR0dmZQMkxuYXRQcW1BVHoKa3ZSeTZBRUNnWUVBOEx1MFVpWW03MXFjNHV0TDVBdGRFbTVlT040ZGtKT3lBYTl5VkV5b00vVXYzMTc5TXAreAp5V2pBNUlWN0duY245NlM2YVV3MXlaaDZnSUJxbFJwbmRpdkFFZ0ZqMGVjS1lvSVJpaHR4OXN6dUVCTWpOMEZQCjR6ejMwckxJVVdTUnNkZG8vVGx5N2U1b2VzU1ZXbDYxdDRlUGxZMUpLNmNpWENpOXhXMUxVbUVDZ1lFQThESWoKRk1RUXdkaVpEWFZ1RmJWM3FzazBaYW1yQ2lxeFBHZm1sOEpIU3pxMmlXRUpTK1RKZ095M1IzVzBrbUFoaEs0SApVQXFzVVBzVDArQVAxTmoxWjNnUWdTWWJrQ1ZSM3o2M2l1VmZLUWs3OHdpalluL2c0WFJEcllhbVdmTDBYOGJwCjk0VVNQQ3dxSXp0RVNISUxCby9zbmRFbDZlR3FuTFk5emRPN21WRUNnWUVBcDI0VmV6RTMwUzlYZ0dlZ1Q4b3IKZ0Y4c3Z5YVVyM0paMHR4QWl5c0pyYUZ4RzAxSWtzWUk5QWtjWjVRQ3k2Um1NdEhxS01RdGdMbkJNZENlMEhjZAowRTJiZDZwcHo1cCtXWWNYUmRQU3pwRTNYZ3pCYUhQUGFUK0ZLWkRZeSt0RGZjcFJKaFdudnA0YklvL0pSS0lzCmhxb05Eam5HMDBxYUZqanJ5LzA0N3VFQ2dZRUE1MG93RTdmMHR1U2VCS0syUFhzL1h4cGVOU0xiQzNBdXVJOEkKTWN3bklKN0oxS0cyOVBpNnZFVzArcit5QUYxSENWOFd0WkdCZW4wN0M0T3ZXdk1MNC9WdVZ4NWQza0RCaEtuOAp6V2V2YVhGMTQ4SEdxbnVmRFJvS2JWYkNhczBUV2dMTm1zWHQyRGxpM2dnYzZYRy9nak1tMHBUcDREdW9NVDBmCmFFcGhVL0VDZ1lCT29kZUxvUm5NdXpicGxqUVMrRzEzKzhLd3A2WWdSU0pxblNNVGRtZnFVMWdVTjA3amF0TXQKN2lkK0tBVlZ6NFBEUWVUTWFXbnFRTllLc3ZDbDQrNkJTc1NvL0FYSGVBWGQwb3djRlhEaDMvNFh5bVIyaEVZYQpwWE9TSkd6enMxOUFDMHdObnZYaHBFWi8rMTFOdTBnR0tjeWp3MnIxUXZpT1U3VkRaSGpMMmc9PQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo=';