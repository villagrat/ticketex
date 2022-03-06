import axios from 'axios';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // executed on server env
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    // executed on browser env
    return axios.create({
      baseURL: '/',
    });
  }
};
