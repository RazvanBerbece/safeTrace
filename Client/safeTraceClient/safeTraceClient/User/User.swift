//
//  User.swift
//  safeTraceClient
//
//  Created by Razvan-Antonio Berbece on 22/11/2020.
//

import Foundation

class User {
    
    private let uid : String?
    private let email: String?
    private var locations: [String]?
    private var currentLocation: Location?
    
    init(uid: String, email: String, locations: [String]) {
        self.uid = uid
        self.email = email
        self.locations = locations
        self.currentLocation = Location(long: 0, lat: 0)
    }
    
    public func getUID() -> String {
        return self.uid!
    }
    
    public func getEmail() -> String {
        return self.email!
    }
    
    public func getLocations() -> [String] {
        return self.locations!
    }
    
    public func setCurrentLocation(updatedCurrentLocation: Location) {
        self.currentLocation = updatedCurrentLocation
    }
    
    public func getCurrentLocation() -> Location {
        return self.currentLocation!
    }
    
}
