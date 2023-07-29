from db import db


def date2str(date):
    yy, mm, dd = date.year, date.month, date.day
    return f"{dd:0>2}/{mm:0>2}/{yy}"


class ReservationsModel(db.Model):
    __tablename__ = 'reservations'

    id = db.Column(db.Integer, primary_key=True)  # Reservation ID
    date_from = db.Column(db.Date, primary_key=False)  # Arrival date
    date_to = db.Column(db.Date, primary_key=False)  # Departure date
    user_id = db.Column(db.Integer, primary_key=False)  # User ID
    room_id = db.Column(db.Integer, primary_key=False)  # Apartment ID

    def json(self):
        return {
            'id': self.id,
            'date_from': date2str(self.date_from),
            'date_to': date2str(self.date_to),
            'user_id': self.user_id,
            'room_id': self.room_id
        }

    @classmethod
    def find_by_user_id(cls, user_id):
        return cls.query.filter_by(user_id=user_id).all()

    @classmethod
    def find_by_room_id(cls, room_id):
        return cls.query.filter_by(room_id=room_id).all()

    @classmethod
    def find_by_id(cls, id):
        return cls.query.filter_by(id=id).first()

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

