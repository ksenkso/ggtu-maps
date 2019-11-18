import BaseEndpoint from '../common';

export default class BuildingsEndpoint extends BaseEndpoint {

  route = 'buildings/';

  constructor(api) {
    super(api);
  }

  async getLocations(id) {
    const response = await this.api.get(this.route + id + '/floors');
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  }

  async getTransitions(locationId) {
    const response = await this.api.get(this.route + locationId + '/transitions');
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  }

  async getFloor(buildingId, floor) {
    const response = await this.api.get(this.route + buildingId + '/floors/' + floor);
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  }
}
