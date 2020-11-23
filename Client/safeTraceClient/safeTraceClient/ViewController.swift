//
//  ViewController.swift
//  safeTraceClient
//
//  Created by Razvan-Antonio Berbece on 22/11/2020.
//

import UIKit
import CoreLocation

class ViewController: UIViewController, CLLocationManagerDelegate {
    
    /** Managers */
    var client : Client?
    let locationManager = CLLocationManager()
    
    /** Global Current User */
    var currentUser : User?
    var currentLocation : Location?
    
    /** UI inputs */
    @IBOutlet weak var emailInput: UITextField!
    @IBOutlet weak var passInput: UITextField!
    
    @IBOutlet weak var uidLabel: UILabel!
    @IBOutlet weak var currentLocationLongitude: UILabel!
    @IBOutlet weak var currentLocationLatitude: UILabel!
    @IBOutlet weak var counterLabel: UILabel!
    @IBOutlet weak var uploadResultLabel: UILabel!
    
    @IBOutlet weak var pushLocationButton: UIButton!
    
    @IBAction func signIn_press() {
        self.client!.signIn(email: self.emailInput.text!, pass: self.passInput.text!) {
            (user) in
            self.uidLabel.text = "Hello, \(user.getUID())"
            self.currentUser = user
            self.pushLocationButton.isHidden = false
        }
    }
    
    @IBAction func pushLocation_press() {
        self.client!.uploadLocation(uid: currentUser!.getUID(), location: currentLocation!) {(counter, sendAlert, failed) in
            if (!failed) {
                self.counterLabel.text = "There are \(counter) people in this area"
                print(sendAlert)
                self.uploadResultLabel.text = "Upload successful !"
            }
            else {
                print("Error occured while uploading location.")
            }
        }
    }

    override func viewDidLoad() {
        
        self.pushLocationButton.isHidden = true
        
        super.viewDidLoad()
        
        /** Client Setup */
        self.client = Client();
        
        /** Location Manager Setup */
        // Ask for Authorisation from the User.
        self.locationManager.requestAlwaysAuthorization()

        // For use in foreground
        self.locationManager.requestWhenInUseAuthorization()

        if CLLocationManager.locationServicesEnabled() {
            locationManager.delegate = self
            locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
            locationManager.startUpdatingLocation()
        }
        
        
        
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let locValue: CLLocationCoordinate2D = manager.location?.coordinate else { return }
        DispatchQueue.main.async {
            // self.currentUser!.setCurrentLocation(updatedCurrentLocation: Location(long: locValue.longitude, lat: locValue.latitude))
            self.currentLocation = Location(long: locValue.longitude, lat: locValue.latitude)
            self.currentLocationLongitude.text = "\(String(describing: self.currentLocation!.getLongitude()))"
            self.currentLocationLatitude.text = "\(String(describing: self.currentLocation!.getLatitude()))"
        }
    }


}

