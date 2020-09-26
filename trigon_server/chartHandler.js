class ChartHandler {
    constructor() {
        this.records = [];
        this.time = 0;
    }

    addRecord(record) {
        this.records.push(record);
    }

    getRecords() {
        return this.records;
    }
}