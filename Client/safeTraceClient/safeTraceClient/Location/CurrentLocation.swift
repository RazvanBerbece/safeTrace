//
//  CurrentLocation.swift
//  safeTraceClient
//
//  Created by Razvan-Antonio Berbece on 22/11/2020.
//

import Foundation

struct Location : Encodable {
    private let longitude : Double
    private let latitude : Double
    
    init(long: Double, lat: Double) {
        self.longitude = long
        self.latitude = lat
    }
    
    public func getLongitude() -> Double {
        return self.longitude
    }
    
    public func getLatitude() -> Double {
        return self.latitude
    }
    
}
