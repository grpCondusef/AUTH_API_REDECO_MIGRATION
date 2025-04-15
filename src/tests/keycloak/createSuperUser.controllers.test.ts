import request from 'supertest';
import app from '../../../src/app'; // Asegúrate de importar tu instancia de Express correctamente
import axios from 'axios';

jest.mock('axios');

jest.mock('../../shared/utils/encriptPassword', () => ({
  encriptPassword: jest.fn().mockReturnValue('hashed_password')
}));

jest.mock('../../infrastructure/database/superUser.Queries', () => ({
  getInstitutionByKey: jest.fn().mockResolvedValue({
    institucionid: 'D2FDFDFF-F622-4BDC-9ECB-BF7B3D62',
    originalid: '69',
    denominacion_social: 'Corporación Financiera...',
    sectorid: '99',
    sector: 'Sociedades Financieras...',
  }),
  getKeyFromUsedKeys: jest.fn().mockResolvedValue(null),
  addUsedKey: jest.fn(),
  createUser: jest.fn(),
}));

jest.mock('../../presentation/controllers/KeyCloakServices/createUserKeyCloak', () => ({
    createUserInKeycloak: jest.fn().mockResolvedValue('fake-kc-id')
  }));
  
  jest.mock('../../presentation/controllers/KeyCloakServices/assignRoleKC', () => ({
    assignARoleKC: jest.fn()
  }));
  

jest.mock('../../shared/utils/generateJTW', () => ({
  generateJWT: jest.fn().mockReturnValue('fake-jwt')
}));




describe('POST /create/superUser/', () => {
  it('debería crear un superusuario exitosamente', async () => {
    // Mockear respuesta del token
    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        access_token: 'fake_access_token',
      },
    });

    const response = await request(app)
    .post('/create/superUser/')
    .send({
      key: '207|69|690158|NO|NO',
      username:'usuarioPruebaKeycloack',
      password: '1234',
      confirm_password: '1234',
      system_key: 1
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body.status).toBe('success');
  });

  it('debería fallar si falta el username', async () => {
    const response = await request(app)
    .post('/create/superUser/')
    .send({
      key: '207|69|690158|NO|NO',
      password: '1234',
      confirm_password: '1234',
      system_key: 1
      });
    expect(response.status).toBe(400);
    expect(response.body.status).toBe('error');
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: 'username' })
      ])
    );
  });
});
