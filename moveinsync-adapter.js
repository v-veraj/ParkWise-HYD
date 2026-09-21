/**
 * Hackathon integration boundary for the MoveInSync employee experience.
 * Replace this mock implementation with the approved UAT API/deep-link contract.
 */
class MoveInSyncAdapter {
  constructor() {
    this.mode = "prototype";
    this.eventKey = "parkwise.moveinsync.integration.events";
  }

  async getEmployeeContext() {
    return {
      employeeId: "DEMO-1001",
      displayName: "Vera",
      worksite: "Microsoft Hyderabad",
      authenticatedBy: "Simulated enterprise SSO"
    };
  }

  async getArrivalIntent() {
    return {
      destination: "Building 4",
      arrivalTime: "10:00",
      transportMode: "registered_vehicle",
      source: "MoveInSync employee app prototype"
    };
  }

  async publishParkingStatus(type, payload = {}) {
    const events = JSON.parse(localStorage.getItem(this.eventKey) || "[]");
    events.push({
      type,
      payload,
      occurredAt: new Date().toISOString(),
      integrationMode: this.mode
    });
    localStorage.setItem(this.eventKey, JSON.stringify(events.slice(-50)));
    window.dispatchEvent(new CustomEvent("moveinsync:parking-status", {
      detail: { type, payload }
    }));
    return { accepted: true, mode: this.mode };
  }

  async openTransportHome() {
    await this.publishParkingStatus("returned_to_transport_home");
    return { opened: true };
  }
}

window.moveInSyncAdapter = new MoveInSyncAdapter();
