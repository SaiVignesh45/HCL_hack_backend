package com.busbooking.repository;

import com.busbooking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Integer> {
    List<Seat> findByBus_BusId(Integer busId);

    @Modifying
    @Query("UPDATE Seat s SET s.status = :bookedStatus WHERE s.seatId = :seatId AND s.status = :availableStatus")
    int bookSeatIfAvailable(@Param("seatId") Integer seatId, @Param("bookedStatus") Seat.SeatStatus bookedStatus, @Param("availableStatus") Seat.SeatStatus availableStatus);
}
