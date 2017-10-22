var Person = {
  name: "",
  sum: 0,
  lat: null,
  long: null
};

// Returns the linear distance between p1 and p2
export function linDistance(p1, p2){
  var phi1 = p1.lat, theta1 = p1.long, phi2 = p2.lat, theta2 = p2.long;
  var distance = Math.sqrt(Math.pow(Math.cos(theta1)*Math.sin(phi1)-Math.cos(theta2)*Math.sin(phi2),2)
    + Math.pow(Math.sin(theta1)*Math.sin(phi1)-Math.sin(theta2)*Math.sin(phi2),2)
    + Math.pow(Math.cos(phi1)-Math.cos(phi2),2)
  );
  return distance;
};

// Returns which person has the smaller sum
export function smallerSum(p1, p2){
  if(p1.sum < p2.sum)
    return p1;
  else
    return p2;
};

// PERSON CONSTRUCTOR
export function makePerson(named, latd, longd){
  return {
    name: named,
    sum: 0,
    lat: latd,
    long: longd
  };
};
//export function setSum 

// Returns the aggregate sum of distances between the target and group
export function findSum(target, group){
  var sum;
  for (var other in group) {
    if(!(other.equals(target))){
        sum += target.linDistance(target, other);
    }
  }
  return sum;
};

// Returns the person with the smallest sum in the group
export function findMinPerson(group){
  var position = 0;
  var minPerson = group[0];
  var index = 0;
  for(position = 0; position < group.length - 1; position++){
    var minSum = group[position].sum;
    for(index = position; index < group.length - 1; ){
      if(group[index].sum + 1 < group[position].sum){
        minPerson = group[index + 1];
        group[index + 1] = group[position];
        group[position] = minPerson;
        index = position;
      }
      else index++;
    };
  };
  return minPerson;
};

// Returns whether the two persons are the same
export function equals(p1, p2){
  if(p1.name == p2.name && p1.long == p2.long && p2.lat == p2.lat)
    return true;
  return false;
};