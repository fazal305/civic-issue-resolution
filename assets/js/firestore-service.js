let civicFirestoreService = {
  getLatestComplaints: function (limitCount) {
    return complaintsCollection
      .orderBy("timestamp", "desc")
      .limit(limitCount)
      .get();
  },
  listenLatestComplaints: function (limitCount, callback, errorCallback) {
    return complaintsCollection
      .orderBy("timestamp", "desc")
      .limit(limitCount)
      .onSnapshot(callback, errorCallback);
  },
  getUserComplaints: function (userId) {
    return complaintsCollection
      .where("uid", "==", userId)
      .orderBy("timestamp", "desc")
      .get();
  },
  listenUserComplaints: function (userId, callback, errorCallback) {
    return complaintsCollection
      .where("uid", "==", userId)
      .orderBy("timestamp", "desc")
      .onSnapshot(callback, errorCallback);
  },
  getAllComplaints: function () {
    return complaintsCollection.orderBy("timestamp", "desc").get();
  },
  listenAllComplaints: function (callback, errorCallback) {
    return complaintsCollection
      .orderBy("timestamp", "desc")
      .onSnapshot(callback, errorCallback);
  },
  getComplaintById: function (complaintId) {
    return complaintsCollection.doc(complaintId).get();
  },

  createComplaint: function (complaintData) {
    return complaintsCollection.add(complaintData);
  },

  updateComplaintStatus: function (complaintId, newStatus) {
    return complaintsCollection.doc(complaintId).update({
      status: newStatus,
    });
  },

  deleteComplaint: function (complaintId) {
    return complaintsCollection.doc(complaintId).delete();
  },
};
